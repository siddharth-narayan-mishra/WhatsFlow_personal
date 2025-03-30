import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Base URLs for API endpoints
const PYTHON_API_BASE_URL = process.env.PYTHON_API_BASE_URL
const FB_API_BASE_URL = process.env.FB_API_BASE_URL

// Facebook API credentials
const WABA_ID = process.env.WABA_ID
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { thread_id } = body;
        console.log("Thread ID = ", thread_id);

        if (!thread_id) {
            return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
        }

        const requestBody = JSON.stringify({ thread_id: thread_id, query: "make flow" });

        const planResponse = await fetch(`${PYTHON_API_BASE_URL}/plan`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });

        if (!planResponse.ok) {
            throw new Error(`Failed to create plan: ${planResponse.statusText}`);
        }

        const planResult = await planResponse.json();
        console.log("Plan created successfully:", planResult);

        const flowResponse = await fetch(`${PYTHON_API_BASE_URL}/get_flows`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });

        if (!flowResponse.ok) {
            throw new Error(`Failed to fetch flows: ${flowResponse.statusText}`);
        }

        const flowResult = await flowResponse.json();
        console.log("Flow result from Python backend:", flowResult);


        const fbHeaders = new Headers();
        fbHeaders.append("Content-Type", "application/json");
        fbHeaders.append("Authorization", `Bearer ${FB_ACCESS_TOKEN}`);

        const fbRequestBody = JSON.stringify({
            "name": uuidv4(),
            "categories": ["OTHER"],
            "flow_json": flowResult.wap_json,
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

        // Return all required data to the frontend, including flow_plan
        return NextResponse.json({
            success: true,
            threadId: thread_id,
            flowId: fbResult.id,
            reactJson: flowResult.react_json,
            previewUrl: previewResult.preview?.preview_url || null,
            flowPlan: planResult.flow_plan || null // Including the flow_plan in the response
        });

    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json({
            error: 'Failed to generate flow',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}