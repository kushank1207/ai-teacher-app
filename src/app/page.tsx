// src/app/page.tsx
"use client";

import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomePage from '@/components/template/HomePage';

export default function Home() {
  const [showHomePage, setShowHomePage] = useState(false);

  const handleShowHomePage = () => {
    setShowHomePage(true);
  };

  const handleReturnToChat = () => {
    setShowHomePage(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {showHomePage ? (
        <HomePage onBackClick={handleReturnToChat} />
      ) : (
        <ChatInterface onShowHomePage={handleShowHomePage} />
      )}
    </main>
  );
}