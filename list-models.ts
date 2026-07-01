import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI();
async function main() {
  const models = await ai.models.list();
  for await (const model of models) {
    if (model.name.includes("flash")) {
      console.log(model.name);
    }
  }
}
main();
