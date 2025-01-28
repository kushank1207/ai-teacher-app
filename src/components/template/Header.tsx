// src/components/template/Header.tsx
"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface HeaderProps {
  onQuestionClick: () => void;
}

export default function Header({ onQuestionClick }: HeaderProps) {
  return (
    <header className="absolute top-4 right-4 flex items-center">
      <button
        className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-3 shadow-md transition flex items-center justify-center"
        onClick={onQuestionClick}
        aria-label="Edit Title"
      >
        <HelpCircle size={28} strokeWidth={2} />
      </button>
    </header>
  );
}
