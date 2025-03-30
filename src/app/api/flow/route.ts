// app/api/flow/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Base URLs for API endpoints
const PYTHON_API_BASE_URL = process.env.PYTHON_API_BASE_URL || 'http://0.0.0.0:5000';
const FB_API_BASE_URL = process.env.FB_API_BASE_URL || 'https://graph.facebook.com/v18.0';

// Facebook API credentials
const WABA_ID = process.env.WABA_ID || '538735706000918';
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN || 'EAA2xTUIuNRsBOZBwAuJdVX1q7qxz7ToSWlOhLXDjC6xmTgJ9ZBiZCsYXq3biegb0D9fevUdTbZBfQDJJoJk0uiq601ept0USZA2I2jt16fA1brXD9T7ffcpnRCGMElw8ngtIXu5t84L5CMZCpZCYJXEuXPW6awIQhZByEKa258fvr5yBK1pvkA8HtXDspCDgFZAnfvwZDZD';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { thread_id } = body;
        console.log("Thread ID = ", thread_id)

        if (!thread_id) {
            return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
        }

        const backendRequestBody = JSON.stringify({ thread_id: thread_id, query: "make flow" })

        // Step 1: Get flows from the Python backend
        const flowResponse = await fetch(`${PYTHON_API_BASE_URL}/get_flows`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: backendRequestBody
        });

        if (!flowResponse.ok) {
            throw new Error(`Failed to fetch flows: ${flowResponse.statusText}`);
        }

        const flowResult = await flowResponse.json();
        console.log("Flow result from Python backend:", flowResult);

        // Step 2: Create flow in Facebook API
        const fbHeaders = new Headers();
        fbHeaders.append("Content-Type", "application/json");

        const fbRequestBody = JSON.stringify({
            "name": thread_id, // Use UUID as name
            "categories": ["OTHER"],
            "flow_json": flowResult.wap_json, // Use wap_json from the Python backend
            "publish": false
        });

        const fbRequestOptions = {
            method: 'POST',
            headers: fbHeaders,
            body: fbRequestBody,
        };

        const fbResponse = await fetch(
            `${FB_API_BASE_URL}/${WABA_ID}/flows`,
            fbRequestOptions
        );

        if (!fbResponse.ok) {
            throw new Error(`Failed to create Facebook flow: ${fbResponse.statusText}`);
        }

        const fbResult = await fbResponse.json();
        console.log("Facebook flow created:", fbResult);

        // Step 3: Get the preview URL
        const previewHeaders = new Headers();
        previewHeaders.append("Authorization", `Bearer ${FB_ACCESS_TOKEN}`);
        previewHeaders.append("Content-Type", "application/json");

        const previewOptions = {
            method: 'GET',
            headers: previewHeaders,
        };

        const previewResponse = await fetch(
            `${FB_API_BASE_URL}/${fbResult.id}?fields=preview.invalidate(false)`,
            previewOptions
        );

        if (!previewResponse.ok) {
            throw new Error(`Failed to get preview URL: ${previewResponse.statusText}`);
        }

        const previewResult = await previewResponse.json();
        console.log("Preview result:", previewResult);

        // Return all required data to the frontend
        return NextResponse.json({
            success: true,
            threadId: thread_id,
            flowId: fbResult.id,
            reactJson: flowResult.react_json,
            previewUrl: previewResult.preview?.preview_url || null
        });

    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json({
            error: 'Failed to generate flow',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}