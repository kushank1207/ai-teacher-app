'use client';

import React from 'react';
import { BookOpen, CheckCircle2, Lock } from 'lucide-react';
import { PYTHON_TOPICS } from '@/lib/constants';

interface ProgressBarProps {
  completedTopics?: string[];
  currentTopic?: string | null;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  completedTopics = [], 
  currentTopic = null 
}) => {
  // Calculate total topics
  const totalTopics = Object.values(PYTHON_TOPICS)
    .reduce((acc, section) => acc + section.topics.length, 0);

  const progress = (completedTopics.length / totalTopics) * 100;

  // Count topics per section
  const sectionProgress = Object.entries(PYTHON_TOPICS).map(([key, section]) => {
    const sectionTopics = section.topics.length;
    const completedInSection = section.topics.filter(
      topic => completedTopics.includes(topic.id)
    ).length;
    return {
      title: section.title,
      completed: completedInSection,
      total: sectionTopics,
      percentage: (completedInSection / sectionTopics) * 100
    };
  });

  return (
    <div className="space-y-3">
      {/* Overall Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Learning Progress</span>
        </div>
        <span className="text-sm font-medium text-gray-500">
          {completedTopics.length}/{totalTopics} topics
        </span>
      </div>
      
      {/* Main Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-3 text-xs flex rounded-lg bg-gray-100">
          {sectionProgress.map((section, index) => (
            <div
              key={index}
              className="relative"
              style={{ width: `${(section.total / totalTopics) * 100}%` }}
            >
              <div
                className={`h-full transition-all duration-500 ${
                  section.completed > 0 ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                style={{ width: `${section.percentage}%` }}
              />
              <div className="absolute inset-0 border-r border-white/20" />
            </div>
          ))}
        </div>
        
        {/* Section Labels */}
        <div className="mt-2 grid grid-cols-5 gap-1 text-xs">
          {sectionProgress.map((section, index) => (
            <div key={index} className="flex flex-col items-center">
              <span className="text-gray-500 truncate text-center w-full">
                {section.completed > 0 ? (
                  <CheckCircle2 className="w-3 h-3 text-green-500 inline-block mr-1" />
                ) : (
                  <Lock className="w-3 h-3 text-gray-400 inline-block mr-1" />
                )}
                {section.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Topic */}
      {currentTopic && (
        <div className="text-xs text-gray-500 flex items-center space-x-1">
          <span>Current focus:</span>
          <span className="font-medium text-blue-600">
            {currentTopic}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;