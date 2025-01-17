"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message as MessageType } from '@/types/chat';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
      >
        <ReactMarkdown
          className={`markdown ${isUser ? 'text-white' : 'text-gray-900'}`}
          components={{
            code: ({ node, inline, className, children, ...props }) => {
              if (inline) {
                return (
                  <code 
                    className={`px-1 py-0.5 ${isUser ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded`} 
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <pre className="p-4 bg-gray-800 text-white rounded-lg overflow-x-auto my-2">
                  <code {...props}>{children}</code>
                </pre>
              );
            },
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;