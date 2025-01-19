// components/chat/ChatInterface.tsx
"use client";

import React, { useState } from "react";
import { useChatStore } from "@/store/chatStore";
import MessageList from "./MessageList";
import InputForm from "./InputForm";
import TopicCard from "@/components/ui/topic-card";
import { MessageSkeleton } from "@/components/ui/loading";
import { Bot, Cpu, MenuIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { PYTHON_TOPICS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Types remain the same
type Subtopic = string;

interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

interface TopicSection {
  title: string;
  topics: Topic[];
}

interface PythonTopics {
  [key: string]: TopicSection;
}

const findTopicById = (
  topicId: string,
  pythonTopics: PythonTopics
): (Topic & { section: string }) | null => {
  for (const section of Object.values(pythonTopics)) {
    const topic = section.topics.find((t) => t.id === topicId);
    if (topic) {
      return { ...topic, section: section.title };
    }
  }
  return null;
};

const ChatInterface: React.FC = () => {
  const { messages, isLoading, addMessage } = useChatStore();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleTopicClick = async (topicId: string) => {
    setActiveTopic(topicId);
    setMobileSidebarOpen(false);

    const selectedTopic = findTopicById(topicId, PYTHON_TOPICS);

    if (selectedTopic) {
      addMessage({
        role: "system",
        content: `Let's focus on ${
          selectedTopic.title
        }. Cover these subtopics: ${selectedTopic.subtopics.join(", ")}`,
        id: Date.now().toString(),
      });

      addMessage({
        role: "assistant",
        content: `Let's explore ${selectedTopic.title}. I'll guide you through the key concepts and provide practical examples. What specific aspect of ${selectedTopic.title} would you like to understand first?`,
        id: (Date.now() + 1).toString(),
      });
    }
  };

  const currentTopic = activeTopic
    ? findTopicById(activeTopic, PYTHON_TOPICS)
    : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white rounded-lg shadow-sm"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Desktop Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={cn(
          "hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-30",
          "items-center justify-center h-12 w-6",
          "bg-white border border-l-0 rounded-r-lg",
          "hover:bg-gray-50 transition-colors",
          isSidebarOpen ? "left-64" : "left-0"
        )}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r",
          "transform transition-transform duration-200 ease-in-out",
          "md:transition-transform",
          {
            // Mobile states
            "translate-x-0": isMobileSidebarOpen,
            "-translate-x-full": !isMobileSidebarOpen,
            // Desktop states
            "md:translate-x-0": isSidebarOpen,
            "md:-translate-x-full": !isSidebarOpen
          }
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Cpu className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">Python OOP</span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
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
        </div>
      </div>

      {/* Main Chat Area */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-h-0 transition-[margin] duration-200 ease-in-out",
          {
            "md:ml-64": isSidebarOpen
          }
        )}
      >
        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bot className="w-6 h-6 text-blue-500" />
              <div>
                <h1 className="text-lg font-semibold">Python OOP Teacher</h1>
                <p className="text-sm text-gray-500">
                  {currentTopic?.title || "Interactive Learning Session"}
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

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden relative min-h-0">
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
          <InputForm />
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatInterface;