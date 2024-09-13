import { NextResponse } from 'next/server';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { llm } from '@/lib/googleai';

export async function POST(req: Request) {
  const request = await req.json();

  try {
    const prompt = `
    You are a very enthusiastic bagong representative who loves
    to help people! Given the following sections from the context,
    answer the question using only that information,
    outputted in markdown format. If you are unsure and the answer
    is not explicitly written in the documentation, say
    "Sorry, I don't know how to help with that."

    Context sections:
    ${request.context}

    Question: """
    ${request.text}
    """

    Answer as text
    `;
    const model = await llm.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      { status: 400 }
    );
  }
}
