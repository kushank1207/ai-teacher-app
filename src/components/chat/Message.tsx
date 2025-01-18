// src/components/chat/Message.tsx

"use client";

import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { Message as MessageType } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageProps {
  message: MessageType;
}

// Define the props for the custom code component
interface CodeComponentProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  children?: React.ReactNode; // Made optional
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  const CodeComponent: React.FC<CodeComponentProps> = ({
    inline,
    className, // Now used
    children,
    ...props
  }) => {
    if (inline) {
      return (
        <code
          className={cn(
            "px-1 py-0.5 rounded",
            isUser ? "bg-blue-600" : "bg-gray-700",
            "text-white",
            className // Utilize className
          )}
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <pre className="p-4 bg-gray-800 text-white rounded-lg overflow-x-auto my-2">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  };

  const components: Components = {
    code: CodeComponent,
    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
    ol: ({ children }) => (
      <ol className="list-decimal ml-4 mb-2">{children}</ol>
    ),
  };

  return (
    <div className={cn("flex mb-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser ? "bg-blue-500 text-white" : "bg-gray-100"
        )}
      >
        <ReactMarkdown
          className={cn("markdown", isUser ? "text-white" : "text-gray-900")}
          components={components}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
