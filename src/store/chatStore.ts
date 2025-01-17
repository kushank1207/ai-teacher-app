// src/store/chatStore.ts
import { create } from 'zustand';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (message) => set((state) => {
    // If it's an update to an existing message
    const messageIndex = state.messages.findIndex(m => m.id === message.id);
    if (messageIndex !== -1) {
      const newMessages = [...state.messages];
      newMessages[messageIndex] = message;
      return { messages: newMessages };
    }

    // If it's a new message
    return { messages: [...state.messages, message] };
  }),

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearMessages: () => set({ messages: [] }),
}));