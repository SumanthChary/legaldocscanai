
import { corsHeaders } from "./cors.ts";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

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

  // Check file type - first by MIME type
  const validType = ALLOWED_FILE_TYPES.includes(file.type);
  
  // If MIME type check fails, try checking by file extension as fallback
  if (!validType && file.name) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['pdf', 'txt', 'doc', 'docx'].includes(extension)) {
      return {
        success: false,
        response: new Response(
          JSON.stringify({ error: 'Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      };
    }
  }

  return { success: true };
}
