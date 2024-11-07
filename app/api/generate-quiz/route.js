import { NextResponse } from 'next/server';

// Function to generate questions using X AI API
async function generateQuestionsWithXAI({ numberOfQuestions, category, level, type }) {
// System prompt to instruct the AI on how to generate questions  
const systemPrompt = `You are a quiz generation assistant. Generate ${numberOfQuestions} ${level}-level ${type}-choice questions about ${category}. 
Your response must be a valid JSON array of question objects. Each object must strictly follow this format:
{
  "question": "question text here",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": 0
}
Do not include any explanatory text or markdown, only return the JSON array.`;

// User prompt to request the AI to generate questions
const userPrompt = `Generate ${numberOfQuestions} ${type}-choice questions about ${category} at ${level} difficulty level. 
Return them as a JSON array where each question has:
- A "question" field with the question text
- An "options" array with ${type === 'multiple' ? '4 options' : '2 options (True/False)'}
- A "correctAnswer" field with the index (0-based) of the correct option
Example format: [{"question": "...", "options": [...], "correctAnswer": 0}]`;

  try {
     // Make a POST request to the X AI API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.X_AI_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        model: "grok-beta"
      })
    });

    // Handle API response errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to communicate with X AI');
    }

    const data = await response.json();
    
    try {
      const assistantMessage = data.choices[0].message.content;
      
      // Add safety check for non-JSON responses
      let cleanedMessage = assistantMessage.trim();
      if (cleanedMessage.startsWith('```json')) {
        cleanedMessage = cleanedMessage.replace(/```json\n?|\n?```/g, '');
      }
      
      const questions = JSON.parse(cleanedMessage);
      
      if (!Array.isArray(questions)) {
        throw new Error('AI response is not an array of questions');
      }

      // Validate each question object has required fields
      questions.forEach((q, index) => {
        if (!q.question || !Array.isArray(q.options) || typeof q.correctAnswer !== 'number') {
          throw new Error(`Invalid question format at index ${index}`);
        }
      });
      
      // Return the generated questions with additional metadata
      return {
        success: true,
        questions: questions.map((q, index) => ({
          id: `q${index + 1}`,
          ...q,
          type,
          level,
          category
        })),
        metadata: {
          total: numberOfQuestions,
          category,
          level,
          type
        }
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw AI response:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response. Please try again.');
    }
  } catch (error) {
    console.error('X AI API Error:', error);
    throw error;
  }
}

// POST handler for generating quiz questions
export async function POST(req) {
  // Check if the X AI API key is configured
  if (!process.env.X_AI_API_KEY) {
    return NextResponse.json(
      { error: 'X AI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { numberOfQuestions, category, level, type } = body;

    // Validate input
    if (!numberOfQuestions || !category || !level || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate number of questions
    if (numberOfQuestions < 1 || numberOfQuestions > 50) {
      return NextResponse.json(
        { error: 'Number of questions must be between 1 and 50' },
        { status: 400 }
      );
    }

    // Generate questions using the X AI API
    const result = await generateQuestionsWithXAI({
      numberOfQuestions,
      category,
      level,
      type
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}