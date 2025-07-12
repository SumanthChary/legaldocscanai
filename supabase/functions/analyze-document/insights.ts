import { createClient } from '@supabase/supabase-js';

// This function is a Supabase Edge Function handler
// Use standard Node.js types for Supabase Edge Functions
// Supabase Edge Function for real-time insights (Deno runtime)
import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Total documents
  const { count: totalDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Analyzed documents
  const { count: analyzedDocs } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'analyzed');

  // Average analysis time
  const { data: avgData } = await supabase
    .from('documents')
    .select('analysis_time')
    .eq('user_id', userId);
  let avgTime = 0;
  if (avgData && avgData.length > 0) {
    const times = avgData.map((d: { analysis_time: number }) => d.analysis_time).filter((t) => typeof t === 'number');
    avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  // Dummy accuracy (replace with real logic if available)
  const accuracy = 98;

  return new Response(
    JSON.stringify({
      totalDocs: totalDocs ?? 0,
      analyzedDocs: analyzedDocs ?? 0,
      avgTime: Number(avgTime.toFixed(2)),
      accuracy
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
