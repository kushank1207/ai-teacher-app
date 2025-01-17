'use client';

import React from 'react';
import { ChevronRight, Check, Circle } from 'lucide-react';

interface TopicCardProps {
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  title,
  description,
  isCompleted,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 border border-blue-100'
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {isCompleted ? (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-600" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
              <Circle className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              isActive ? 'text-blue-600' : 'text-gray-900'
            } truncate`}>
              {title}
            </p>
            <ChevronRight className={`w-4 h-4 ${
              isActive ? 'text-blue-500' : 'text-gray-400'
            }`} />
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};

export default TopicCard;