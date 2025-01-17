// src/components/DebugPanel.tsx
'use client';

import { useChatStore } from '@/store/chatStore';

const DebugPanel = () => {
  const { messages, isLoading } = useChatStore();

  return process.env.NODE_ENV === 'development' ? (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-80 text-white p-4 m-4 rounded-lg text-sm max-w-md overflow-auto max-h-48">
      <div>Loading: {String(isLoading)}</div>
      <div>Messages:</div>
      <pre className="text-xs">
        {JSON.stringify(messages, null, 2)}
      </pre>
    </div>
  ) : null;
};

export default DebugPanel;