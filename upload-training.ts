import { parse } from "https://deno.land/std@0.182.0/yaml/mod.ts";
import { client } from "./client.ts";

const yaml = await Deno.readTextFile("./training.yaml");
const training = parse(yaml) as {
  prompt: string;
  completion: string;
}[];

const trainingString = training
  .map(({ prompt, completion }) => JSON.stringify({ prompt, completion }))
  .join("\n");
console.log("uploading training file", { trainingPairs: training.length });

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
console.log("created fine tune", JSON.stringify(fineTune, null, 4));
