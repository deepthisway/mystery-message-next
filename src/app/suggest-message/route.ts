import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();
    const prompt = "ndsfkjnsd"  // add custom prompt here
  
    const result = streamText({
      model: openai('gpt-4o'),
      prompt
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    if(error instanceof OpenAI.APIError)    {
        const {name, status, headers, message} = error;
        return NextResponse.json({
            name, status, headers, message
        },{status})
    }
    else {
        console.error("Unexpected error:", error);
        return NextResponse.json({
            status: false,
            message: "An unexpected error occurred."
        }, { status: 500 });
    }
  }
}