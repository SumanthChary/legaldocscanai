
import { corsHeaders } from "./cors.ts";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function validateFileUpload(file: File | null) {
  if (!file) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'File size exceeds the 50MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  return { success: true };
}
