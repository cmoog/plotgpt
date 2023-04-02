import * as openai from "./openai/mod.ts";
import { parse } from "https://deno.land/std@0.182.0/yaml/mod.ts";

const apiKey = Deno.env.get("OPENAI_API_KEY");
if (!apiKey) {
  throw new Error("OPENAI_API_KEY required");
}

const client = new openai.OpenAI(apiKey);

const yaml = await Deno.readTextFile("./training.yaml");

const { data: training } = parse(yaml) as {
  data: { prompt: string; completion: string }[];
};

const trainingString = training
  .map(({ prompt, completion }) => JSON.stringify({ prompt, completion }))
  .join("\n");

console.log(trainingString);
const trainingFile = await client.uploadFile(
  "plotgpt-training.jsonl",
  trainingString,
  "fine-tune",
);

console.log("uploaded file", JSON.stringify(trainingFile, null, 4));

const fineTune = await client.createFineTune({
  model: "davinci",
  trainingFile: trainingFile.id,
});
console.log({ fineTune });
