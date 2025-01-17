// src/components/chat/InputForm.tsx
"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

const InputForm = () => {
  const [input, setInput] = useState("");
  const { addMessage, isLoading } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
      id: Date.now().toString(),
    };

    addMessage(userMessage);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [userMessage],
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      // Start reading the stream
      const reader = response.body?.getReader();
      let accumulatedResponse = "";

      // Add initial assistant message
      const assistantMessageId = Date.now().toString();
      addMessage({
        role: "assistant",
        content: "",
        id: assistantMessageId,
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedResponse += text;

        addMessage({
          role: "assistant",
          content: accumulatedResponse,
          id: assistantMessageId,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        id: Date.now().toString(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about Python OOP..."
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
