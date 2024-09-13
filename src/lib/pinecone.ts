'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_APIKEY as string,
})
  .index('gemini-test')
  .namespace('langchain');

export const Upsert = async (content: string, embed: any) => {
  await pc.upsert([
    {
      id: 'rifki',
      values: embed,
      metadata: { values: content },
    },
  ]);
};

export const similiaritySearch = async (embed: any) => {
  const result = await pc.query({
    vector: embed,
    topK: 3,
    includeMetadata: true,
  });

  return result;
};
