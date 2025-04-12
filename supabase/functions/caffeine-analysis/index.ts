
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Replace OpenAI with Gemini API key
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { user_id, timeframe = 'week', dailyTotal, recommendedLimit } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ 
          insights: "Please log in to get personalized insights.",
          recommendations: ["Start tracking your daily caffeine intake to get personalized insights."]
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If Gemini API key is available, use it to generate personalized insights
    if (geminiApiKey) {
      console.log("Generating AI insights using Google Gemini");
      
      // Create the prompt with the user's caffeine data
      const prompt = `
        I'm tracking a user's caffeine consumption. Here's their data:
        - Current daily intake: ${dailyTotal || "Unknown"} mg
        - Recommended daily limit: ${recommendedLimit || 400} mg
        - Timeframe requested: ${timeframe}
        
        Based on this information, please provide:
        1. A brief insight about their caffeine habits
        2. 2-4 recommendations to help them manage their caffeine intake better
        3. Any concerns based on their consumption pattern
        
        Format your response as a JSON object with the keys "insights", "recommendations" (array), and "concerns" (array).
        Keep the insights concise and helpful. If they've exceeded their limit, emphasize moderation.
      `;
      
      try {
        // Use Gemini API for text generation
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          })
        });
        
        const data = await response.json();
        
        if (data.error) {
          console.error("Gemini API error:", data.error);
          throw new Error(data.error.message);
        }
        
        // Extract the generated content from Gemini response
        const content = data.candidates[0].content.parts[0].text;
        
        // Parse the JSON response from Gemini
        try {
          // Some cleaning in case Gemini returns markdown or extra text
          const jsonContent = content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
            
          const parsedContent = JSON.parse(jsonContent);
          console.log("Successfully generated AI insights with Gemini");
          
          return new Response(
            JSON.stringify(parsedContent),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (jsonError) {
          console.error("Failed to parse Gemini response as JSON:", jsonError);
          console.log("Raw content:", content);
          throw new Error("Failed to parse AI response");
        }
      } catch (aiError) {
        console.error("Error generating insights with Gemini AI:", aiError);
        // Fall back to rule-based insights if AI fails
      }
    }
    
    // Fallback: Use rule-based insights if Gemini is unavailable or fails
    console.log("Using rule-based insights (fallback)");
    
    // Simple rule-based insights based on daily total
    let insights, recommendations, concerns;
    
    if (!dailyTotal || dailyTotal === 0) {
      insights = "No caffeine data recorded yet for today.";
      recommendations = [
        "Start tracking your caffeine intake regularly.",
        "Try logging each drink as you consume it for accurate tracking."
      ];
      concerns = [];
    } else if (dailyTotal > recommendedLimit) {
      insights = `You've consumed ${dailyTotal}mg of caffeine today, which exceeds the recommended daily limit of ${recommendedLimit}mg.`;
      recommendations = [
        "Consider switching to decaffeinated options for the rest of the day.",
        "Stay hydrated by drinking plenty of water.",
        "Be mindful of potential effects on sleep quality tonight."
      ];
      concerns = [
        "Exceeding the recommended caffeine limit may cause jitteriness, anxiety, or sleep disturbances.",
        "High caffeine intake can increase heart rate and blood pressure temporarily."
      ];
    } else if (dailyTotal > recommendedLimit * 0.75) {
      insights = `You're at ${dailyTotal}mg of caffeine today, which is approaching the recommended daily limit.`;
      recommendations = [
        "Consider lower-caffeine alternatives for your next drink.",
        "Space out remaining caffeine intake throughout the day.",
        "Stay hydrated with water alongside caffeinated beverages."
      ];
      concerns = [
        "Consuming caffeine too late in the day may affect sleep quality."
      ];
    } else {
      insights = `Your caffeine intake today (${dailyTotal}mg) is within the recommended daily limit.`;
      recommendations = [
        "Continue to space out your caffeine intake for consistent energy.",
        "Remember to stay hydrated throughout the day.",
        "Tracking patterns over time can help you optimize your caffeine consumption."
      ];
      concerns = [];
    }
    
    return new Response(
      JSON.stringify({ 
        insights,
        recommendations,
        concerns
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
