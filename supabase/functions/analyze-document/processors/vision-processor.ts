
import { analyzeWithVision } from "../groqcloud-client.ts";

export async function processWithGroqVision(text: string, fileBuffer: ArrayBuffer, fileExtension: string): Promise<string> {
  console.log("🖼️ GroqCloud Vision ULTRA-FAST processing");
  
  let base64Data: string;
  if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
    base64Data = `data:${mimeType};base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
  } else {
    base64Data = `data:application/pdf;base64,${btoa(String.fromCharCode(...new Uint8Array(fileBuffer)))}`;
  }
  
  return await analyzeWithVision(base64Data, text);
}
