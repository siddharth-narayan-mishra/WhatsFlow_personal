import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { thread_id, user_input } = await req.json();

        console.log("thread id = ",thread_id,"\nuser input = ",user_input)
        console.log("endpoint = ", process.env.PYTHON_API_BASE_URL)

        const response = await fetch(`${process.env.PYTHON_API_BASE_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ thread_id, user_input }),
        });

        console.log(response)

        if (!response.ok) {
            console.log(response)
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
