
import { corsHeaders } from "./cors.ts";

export async function checkDocumentLimits(supabaseClient: any, userId: string) {
  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('document_count, document_limit')
    .eq('id', userId)
    .single();
  
  if (profileError) {
    console.error("Profile fetch error:", profileError);
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Failed to retrieve user profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }
  
  if (profile.document_count >= profile.document_limit) {
    return {
      success: false,
      response: new Response(
        JSON.stringify({ error: 'Document limit reached. Please upgrade your plan for more documents.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    };
  }

  return { success: true };
}
