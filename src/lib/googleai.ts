import { GoogleGenerativeAI } from '@google/generative-ai';

export const llm = new GoogleGenerativeAI(
  process.env.GOOGLE_AI_APIKEY as string
);
