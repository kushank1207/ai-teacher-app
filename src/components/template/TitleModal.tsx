// src/components/template/TitleModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

interface TitleModalProps {
  isOpen: boolean;
  currentTitle: string;
  onSave: (newTitle: string) => void;
  onClose: () => void;
}

export default function TitleModal({
  isOpen,
  currentTitle,
  onSave,
  onClose,
}: TitleModalProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);

  useEffect(() => {
    setNewTitle(currentTitle);
  }, [currentTitle]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById("titleInput")?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (newTitle.trim() === "") return;
    onSave(newTitle);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-5 text-center">
          Edit Title
        </h2>

        {/* Input Field with Save Button */}
        <div className="relative">
          <input
            id="titleInput"
            type="text"
            className="w-full border border-gray-300 rounded-xl px-5 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button
            onClick={handleSave}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition shadow-md"
          >
            <Save size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
