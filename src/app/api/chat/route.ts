// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PYTHON_TOPICS } from '@/lib/constants';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are an expert Python teacher specializing in Object-Oriented Programming (OOP). 
Your curriculum covers:
${Object.values(PYTHON_TOPICS)
  .map(section => `${section.title}:
${section.topics.map(topic => `- ${topic.title}`).join('\n')}`)
  .join('\n\n')}

Teaching approach:
- Start with basic concepts and progressively introduce more advanced topics
- Always include practical, runnable code examples
- Reference previous examples when introducing new concepts
- Provide small coding challenges to reinforce learning
- Keep track of concepts covered and build upon them
- Maintain a friendly, encouraging tone
- Use real-world analogies to explain complex concepts

Important:
- Keep responses focused on Python OOP
- Track which concepts have been covered
- Ensure code examples are complete and runnable
- Encourage hands-on practice
- Provide gentle corrections when needed

Current teaching progress: Beginning the journey`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Create a readable stream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(stream);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}