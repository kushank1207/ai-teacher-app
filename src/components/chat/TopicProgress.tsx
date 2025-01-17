// Replace the ProgressBar in ChatInterface with a TopicProgress component
// src/components/chat/TopicProgress.tsx
'use client';

import React from 'react';
import { useChatStore } from '@/store/chatStore';
import { Bot } from 'lucide-react';

const TopicProgress = () => {
  const { messages } = useChatStore();
  const userMessages = messages.filter(m => m.role === 'user').length;

  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium">Session Progress</span>
        </div>
        {userMessages > 0 && (
          <span className="text-sm text-gray-500">
            {userMessages} questions asked
          </span>
        )}
      </div>
    </div>
  );
};

export default TopicProgress;