// src/components/chat/MessageList.tsx
import React, { useRef, useEffect } from "react";
import { Message } from "@/store/chatStore";
import { Bot, User, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ProcessedResponse {
  summary: string;
  randomNumber: number;
  originalResponse: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onViewClick?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onViewClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const extractProcessedResponse = (
    content: string
  ): {
    displayContent: string;
    processedResponse: ProcessedResponse | null;
  } => {
    const markerIndex = content.indexOf("[[PROCESSED_RESPONSE:");
    if (markerIndex === -1) {
      return { displayContent: content, processedResponse: null };
    }

    try {
      const markerEnd = content.indexOf("]]", markerIndex);
      const jsonStr = content.slice(
        markerIndex + "[[PROCESSED_RESPONSE:".length,
        markerEnd
      );
      const processedResponse = JSON.parse(jsonStr);
      const displayContent = content.slice(0, markerIndex).trim();

      return { displayContent, processedResponse };
    } catch (error) {
      console.error("Error parsing processed response:", error);
      return { displayContent: content, processedResponse: null };
    }
  };

  const handleViewClick = (processedResponse: ProcessedResponse) => {
    if (onViewClick) {
      localStorage.setItem(
        "processedResponse",
        JSON.stringify(processedResponse)
      );
      onViewClick();
    }
  };

  const renderMessage = (message: Message) => {
    const { displayContent, processedResponse } = extractProcessedResponse(
      message.content
    );

    return (
      <div
        key={message.id}
        className={cn(
          "flex items-start space-x-3",
          message.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        {(message.role === "assistant" || message.role === "system") && (
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            {processedResponse && (
              <button
                onClick={() => handleViewClick(processedResponse)}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex flex-col max-w-[70%] space-y-2",
            message.role === "user" ? "items-end" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-2xl px-4 py-2",
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-white border shadow-sm"
            )}
          >
            <ReactMarkdown
              className={cn(
                "prose prose-sm max-w-none",
                message.role === "user" ? "text-white" : "text-gray-900"
              )}
            >
              {displayContent}
            </ReactMarkdown>
          </div>
        </div>

        {message.role === "user" && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Bot className="w-12 h-12 mb-4" />
          <p className="text-lg font-medium">Welcome to Python OOP Learning!</p>
          <p className="text-sm">Start your journey by asking a question.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="bg-white border rounded-2xl px-4 py-2 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
