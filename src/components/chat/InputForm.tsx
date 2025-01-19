// components/chat/InputForm.tsx
"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useChatStore, Message } from "@/store/chatStore";
import { PYTHON_TOPICS } from "@/lib/constants";

const InputForm = () => {
  const [input, setInput] = useState("");
  const {
    messages,
    addMessage,
    isLoading,
    setLoading,
    setError,
    topicProgress,
    updateSubtopicProgress,
  } = useChatStore();

  const getCurrentTopic = () => {
    const { currentTopicId } = topicProgress;
    if (!currentTopicId) return null;

    return Object.values(PYTHON_TOPICS)
      .flatMap((section) => section.topics)
      .find((topic) => topic.id === currentTopicId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      id: Date.now().toString(),
    };

    setLoading(true);
    addMessage(userMessage);
    setInput("");

    try {
      const currentTopic = getCurrentTopic();
      const subtopics = currentTopic
        ? topicProgress.subtopicProgress[currentTopic.id] || []
        : [];

      // Get the last two messages for context
      const recentMessages = messages.slice(-2);
      const conversationContext = [...recentMessages, userMessage];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationContext,
          currentTopic,
          understanding: topicProgress.understanding,
          subtopics,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch response");
      }

      const reader = response.body.getReader();
      let accumulatedResponse = "";

      const assistantMessageId = Date.now().toString();
      const initialAssistantMessage: Message = {
        role: "assistant",
        content: "",
        id: assistantMessageId,
      };

      addMessage(initialAssistantMessage);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedResponse += text;

        const updatedMessage: Message = {
          role: "assistant",
          content: accumulatedResponse,
          id: assistantMessageId,
        };

        addMessage(updatedMessage);
      }

      // Update progress if understanding is indicated
      if (
        currentTopic &&
        (accumulatedResponse.toLowerCase().includes("great!") ||
          accumulatedResponse.toLowerCase().includes("correct!") ||
          accumulatedResponse.toLowerCase().includes("exactly!") ||
          accumulatedResponse.toLowerCase().includes("that's right!"))
      ) {
        const currentSubtopics =
          topicProgress.subtopicProgress[currentTopic.id] || [];
        currentSubtopics.forEach((subtopic) => {
          if (
            accumulatedResponse
              .toLowerCase()
              .includes(subtopic.name.toLowerCase())
          ) {
            updateSubtopicProgress(currentTopic.id, subtopic.name, true);
          }
        });
      }

      setError(null);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error. Could you please try your question again?",
        id: Date.now().toString(),
      };
      addMessage(assistantMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything about Python..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};

export default InputForm;
