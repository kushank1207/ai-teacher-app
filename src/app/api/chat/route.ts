// src/app/api/chat/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

interface Topic {
  id: string;
  title: string;
  subtopics: string[];
}

interface SubtopicProgress {
  name: string;
  completed: boolean;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  id: string;
}

interface ProcessedResponse {
  summary: string;
  randomNumber: number;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getTeachingPrompt = (
  currentTopic: Topic | null,
  understanding: string,
  subtopics: SubtopicProgress[]
) => {
  const basePrompt = `You are a friendly and patient Python programming teacher. Your goal is to guide students through learning Object-Oriented Programming in Python.

Teaching Style Guidelines:
1. Keep the Conversation Flowing
- Always acknowledge student responses positively
- Build on previous concepts
- Ask focused questions to guide learning
- Keep responses concise (2-3 paragraphs maximum)

2. Structured Teaching Approach
- Start with fundamentals before complex concepts
- Use real-world analogies
- Provide concrete, runnable code examples
- Check understanding with simple questions
- When student answers correctly, provide positive reinforcement and build on their understanding
- When student shows confusion, gently correct and explain differently

3. Code Examples
- Start with very basic examples
- Include clear comments
- Show output of code
- Encourage experimentation

4. Assessment
- Ask one clear question at a time
- Wait for student response before moving on
- Provide immediate, constructive feedback
- If student understands, offer to move to next concept
- If student is confused, try a different explanation approach`;

  if (currentTopic) {
    return `${basePrompt}

Current Topic: ${currentTopic.title}
Learning Stage: ${understanding}
Subtopics to Cover: ${subtopics.map((st) => st.name).join(", ")}
Completed Subtopics: ${subtopics
      .filter((st) => st.completed)
      .map((st) => st.name)
      .join(", ")}`;
  }

  return basePrompt;
};

const getSummaryPrompt = (content: string) => {
  return `Please provide a very concise summary (1-2 sentences) of the following teaching response, focusing on the main concepts discussed: ${content}
  Keep your summary brief and focused on the key points.`;
};

async function processWithSecondLLM(
  content: string
): Promise<ProcessedResponse> {
  try {
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: getSummaryPrompt(content),
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const randomNumber = Math.floor(Math.random() * 1000) + 1;

    const processedResponse: ProcessedResponse = {
      summary: summaryResponse.choices[0]?.message?.content || "",
      randomNumber,
    };

    return processedResponse;
  } catch (error) {
    console.error("Error in secondary processing:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { messages, currentTopic, understanding, subtopics } =
      (await req.json()) as {
        messages: Message[];
        currentTopic: Topic | null;
        understanding: string;
        subtopics: SubtopicProgress[];
      };

    const conversationWithContext = messages.map((msg: Message) => {
      if (msg.role === "user") {
        return {
          ...msg,
          content: `[Student Message]: ${msg.content}`,
        };
      }
      return msg;
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: getTeachingPrompt(
            currentTopic,
            understanding,
            subtopics || []
          ),
        },
        ...conversationWithContext,
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 800,
    });

    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              fullResponse += text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }

          const processedResponse = await processWithSecondLLM(fullResponse);
          const processedMarker = `\n\n[[PROCESSED_RESPONSE:${JSON.stringify(
            processedResponse
          )}]]`;
          controller.enqueue(new TextEncoder().encode(processedMarker));

          controller.close();
        } catch (error) {
          console.error("Stream processing error:", error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
