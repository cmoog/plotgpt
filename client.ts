import { OpenAI } from "./openai/mod.ts";

const apiKey = Deno.env.get("OPENAI_API_KEY");
if (!apiKey) {
  throw new Error("OPENAI_API_KEY required");
}

export const client = new OpenAI(apiKey);
