// src/types/chat.ts

import { ReactNode } from "react";

export type Role = "user" | "assistant" | "system";

export interface Message {
  role: Role;
  content: string;
  timestamp?: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  messageCount: number;
  coveredTopics: Set<string>;
}

export interface ChatResponse {
  content: string;
  error?: string;
}

export interface StreamResponse {
  done: boolean;
  value?: Uint8Array;
}

export interface MessageRequest {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
}

export type TopicStatus = "not-started" | "in-progress" | "completed";

export interface TopicProgress {
  topic: string;
  status: TopicStatus;
  completionPercentage: number;
}

export interface ChatContextValue {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  resetChat: () => void;
}

// API Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

// Re-export the Message type from chatStore to ensure consistency
export type { Message as StoreMessage } from "@/store/chatStore";

export interface MarkdownProps {
  children?: ReactNode;
  inline?: boolean;
  className?: string;
  [key: string]: any;
}
