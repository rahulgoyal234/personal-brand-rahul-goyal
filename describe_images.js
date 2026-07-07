import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const imagesDir = path.join(process.cwd(), "src/assets/images");
  const files = [
    "avatar_1783346962733.jpg",
    "avatar_1783347248558.jpg"
  ];
  
  console.log("Analyzing files:", files);
  
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const data = fs.readFileSync(filePath);
    const base64Data = data.toString("base64");
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data
            }
          },
          "Describe this image in detail. Specifically, is it a real photo of a young South Asian man with thick black-framed glasses wearing a black shirt, or is it an AI-generated portrait/avatar of someone else? Be very precise."
        ]
      });
      console.log(`\n--- Result for ${file} ---`);
      console.log(response.text);
    } catch (err) {
      console.error(`Error analyzing ${file}:`, err);
    }
  }
}

run();
