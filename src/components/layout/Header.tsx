// src/components/layout/Header.tsx
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Python OOP Teacher</h1>
          <nav className="flex items-center space-x-4">
            <button 
              onClick={() => window.location.reload()} 
              className="text-gray-600 hover:text-gray-900"
            >
              Reset Chat
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;