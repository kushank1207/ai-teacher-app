// src/components/chat/ChatInterface.tsx
"use client";

import React, { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import MessageList from "./MessageList";
import InputForm from "./InputForm";
import ProgressBar from "./ProgressBar";
import TopicCard from "@/components/ui/topic-card";
import { MessageSkeleton, TopicSkeleton } from "@/components/ui/loading";
import { Bot, Cpu, MenuIcon, X } from "lucide-react";
import { PYTHON_TOPICS } from "@/lib/constants";

const ChatInterface: React.FC = () => {
  const { messages, isLoading, messageCount, addMessage } = useChatStore();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleTopicClick = async (topicId: string) => {
    setActiveTopic(topicId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection

    // Find the selected topic details
    let selectedTopic = null;
    for (const section of Object.values(PYTHON_TOPICS)) {
      const topic = section.topics.find((t) => t.id === topicId);
      if (topic) {
        selectedTopic = { ...topic, section: section.title };
        break;
      }
    }

    if (selectedTopic) {
      // Add a system message to redirect the conversation
      addMessage({
        role: "system",
        content: `Let's focus on ${
          selectedTopic.title
        }. Cover these subtopics: ${selectedTopic.subtopics.join(", ")}`,
        id: Date.now().toString(),
      });

      // Add an AI message to transition to the new topic
      addMessage({
        role: "assistant",
        content: `Let's explore ${selectedTopic.title}. I'll guide you through the key concepts and provide practical examples. What specific aspect of ${selectedTopic.title} would you like to understand first?`,
        id: (Date.now() + 1).toString(),
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-sm"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">Python OOP</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Topics List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Learning Topics
            </h2>
            <div className="space-y-2">
              {Object.entries(PYTHON_TOPICS).map(([key, section]) => (
                <div key={key} className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">
                    {section.title}
                  </h3>
                  {section.topics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      title={topic.title}
                      description={topic.subtopics.join(", ")}
                      isCompleted={false}
                      isActive={activeTopic === topic.id}
                      onClick={() => handleTopicClick(topic.id)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-4 border-t">
            <ProgressBar messageCount={messageCount} />
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {" "}
        {/* Added min-h-0 */}
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6 text-blue-500" />
              <div>
                <h1 className="text-lg font-semibold">Python OOP Teacher</h1>
                <p className="text-sm text-gray-500">
                  {activeTopic
                    ? Object.values(PYTHON_TOPICS)
                        .flatMap((section) => section.topics)
                        .find((t) => t.id === activeTopic)?.title
                    : "Interactive Learning Session"}
                </p>
              </div>
            </div>
            {messages.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {messages.filter((m) => m.role === "user").length} messages
                  exchanged
                </span>
              </div>
            )}
          </div>
        </header>
        {/* Messages Area - Now properly scrollable */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          {" "}
          {/* Added min-h-0 */}
          <div className="absolute inset-0 overflow-y-auto">
            {isLoading && messages.length === 0 ? (
              <div className="p-4 space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <MessageSkeleton key={i} />
                  ))}
              </div>
            ) : (
              <MessageList messages={messages} isLoading={isLoading} />
            )}
          </div>
        </div>
        {/* Input Form */}
        <div className="border-t bg-white p-4 flex-shrink-0">
          {" "}
          {/* Added flex-shrink-0 */}
          <InputForm />
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
