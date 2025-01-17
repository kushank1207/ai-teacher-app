'use client';

import React, { useRef, useEffect } from 'react';
import { Message as MessageType } from '@/types/chat';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

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
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Bot avatar for both assistant and system messages */}
              {(message.role === 'assistant' || message.role === 'system') && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              )}
              
              <div className={cn(
                "flex flex-col max-w-[70%] space-y-2",
                message.role === 'user' ? 'items-end' : 'items-start'
              )}>
                <div className={cn(
                  "rounded-2xl px-4 py-2",
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border shadow-sm'
                )}>
                  <ReactMarkdown
                    className={cn(
                      'prose prose-sm max-w-none',
                      message.role === 'user' ? 'text-white' : 'text-gray-900'
                    )}
                    components={{
                      // eslint-disable-next-line
                      code({ inline, className: _, node: __, children, ...props }) {
                        return (
                          <code
                            className={cn(
                              "px-1 py-0.5 rounded font-mono text-sm",
                              inline 
                                ? message.role === 'user' 
                                  ? 'bg-blue-400 text-white'
                                  : 'bg-gray-100 text-gray-900'
                                : 'block bg-gray-800 text-gray-50 p-4 my-2 rounded-lg overflow-x-auto'
                            )}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}

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