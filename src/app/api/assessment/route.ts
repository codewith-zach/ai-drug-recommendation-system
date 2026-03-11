import { NextResponse } from "next/server";
import { parseAssessmentPayload } from "@/lib/assessment";
import { generateAssessmentWithAI } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = parseAssessmentPayload(payload);
    const result = await generateAssessmentWithAI(input);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to process your request right now.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 400 },
    );
  }
}
