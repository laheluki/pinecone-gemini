import { NextResponse } from 'next/server';
import { llm } from '@/lib/googleai';

export async function POST(req: Request) {
  const request = await req.json();
  if (!request.text) {
    return NextResponse.json(
      {
        message: 'Invalid request text',
      },
      { status: 422 }
    );
  }

  try {
    const model = await llm.getGenerativeModel({
      model: 'text-embedding-004',
    });

    const result = await model.embedContent(request.text);
    const embedding = result.embedding;
    return NextResponse.json({ embedding });
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Something went wrong',
      },
      { status: 400 }
    );
  }
}
