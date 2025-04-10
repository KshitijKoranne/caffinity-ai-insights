
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { user_id, timeframe = 'week' } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    // Get user's caffeine entries
    let { data: entries, error } = await supabase
      .from('caffeine_entries')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching caffeine entries:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch caffeine data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({ 
          insights: "Not enough data to generate insights. Please log more caffeine entries.",
          recommendations: ["Start tracking your daily caffeine intake to get personalized insights."]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Analyze the data with OpenAI
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare data for OpenAI
    const dataToAnalyze = entries.map(entry => ({
      date: entry.created_at,
      beverage: entry.beverage_name,
      caffeineAmount: entry.caffeine_amount,
      time: new Date(entry.created_at).toLocaleTimeString()
    }));
    
    const prompt = `
      Analyze this user's caffeine consumption data:
      ${JSON.stringify(dataToAnalyze)}
      
      Please provide:
      1. A concise insight about their caffeine consumption patterns (timing, amount, frequency)
      2. Three specific recommendations to help optimize their caffeine intake for better health and energy levels
      3. Any potential issues or concerns based on their consumption patterns
      
      Return your analysis as a JSON object with these keys: insights, recommendations (an array of strings), concerns (an array of strings).
      Keep the insights under 100 words, and make each recommendation and concern around 15-30 words.
    `;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI specialized in analyzing caffeine consumption patterns and providing health insights.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    const aiResult = await response.json();
    
    if (!aiResult.choices || aiResult.choices.length === 0) {
      console.error('Invalid AI response:', aiResult);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze caffeine data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the AI response
    let analysisResult;
    try {
      const aiContent = aiResult.choices[0].message.content;
      analysisResult = JSON.parse(aiContent);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return new Response(
        JSON.stringify({ error: 'Failed to process analysis results' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in caffeine-analysis function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
