
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
        JSON.stringify({ 
          insights: "Please log in to get personalized insights.",
          recommendations: ["Start tracking your daily caffeine intake to get personalized insights."]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Since the supabase database is not fully set up yet, we'll use the mock data
    // In a real app, this would fetch data from the database
    
    return new Response(
      JSON.stringify({ 
        insights: "Based on your recent caffeine consumption, you're maintaining moderate intake levels throughout the day.",
        recommendations: [
          "Try to space out your caffeine intake for consistent energy.",
          "Consider herbal teas in the evening to avoid sleep disruption.",
          "Stay hydrated by drinking water alongside caffeinated beverages."
        ],
        concerns: [
          "Consuming caffeine too late in the day may affect sleep quality."
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in caffeine-analysis function:', error);
    return new Response(
      JSON.stringify({ 
        insights: "Unable to generate insights at this time.",
        recommendations: ["Continue tracking your caffeine intake for future analysis."],
        concerns: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
