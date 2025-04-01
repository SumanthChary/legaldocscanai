
import { corsHeaders } from "./cors.ts";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_EXTENSIONS = ['pdf', 'txt', 'doc', 'docx'];

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

  console.log(`Validating file: ${file.name}, type: ${file.type}, size: ${file.size}`);

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'File size exceeds the 50MB limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  // Check by MIME type
  const validMimeType = ALLOWED_FILE_TYPES.includes(file.type);
  
  // Check by file extension as fallback
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const validExtension = ALLOWED_EXTENSIONS.includes(extension);
  
  if (!validMimeType && !validExtension) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: `Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files. Got type: ${file.type}, extension: ${extension}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  console.log("File validation successful");
  return { success: true };
}
