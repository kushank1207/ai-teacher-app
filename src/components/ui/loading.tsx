'use client';

import React from 'react';

export const MessageSkeleton = () => {
  return (
    <div className="flex items-start space-x-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-200 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

export const TopicSkeleton = () => {
  return (
    <div className="p-3 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-5 h-5 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
};

export const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 animate-pulse">Loading...</p>
      </div>
    </div>
  );
};