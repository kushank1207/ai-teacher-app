// src/store/chatStore.ts
import { create } from "zustand";
import { PYTHON_TOPICS } from "@/lib/constants";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  id: string;
}

interface SubtopicProgress {
  name: string;
  completed: boolean;
}

interface TopicProgress {
  currentTopicId: string | null;
  completedTopics: string[];
  subtopicProgress: Record<string, SubtopicProgress[]>;
  understanding: "not_started" | "learning" | "practicing" | "completed";
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  topicProgress: TopicProgress;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  setCurrentTopic: (topicId: string) => void;
  updateSubtopicProgress: (
    topicId: string,
    subtopicName: string,
    completed: boolean
  ) => void;
  setUnderstanding: (level: TopicProgress["understanding"]) => void;
  moveToNextTopic: () => string | null;
  getProgress: () => {
    topicProgress: number;
    overallProgress: number;
    completedSubtopics: number;
    totalSubtopics: number;
  };
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  topicProgress: {
    currentTopicId: null,
    completedTopics: [],
    subtopicProgress: {},
    understanding: "not_started",
  },

  addMessage: (message) =>
    set((state) => {
      const messageIndex = state.messages.findIndex((m) => m.id === message.id);
      if (messageIndex !== -1) {
        const newMessages = [...state.messages];
        newMessages[messageIndex] = message;
        return { messages: newMessages };
      }
      return { messages: [...state.messages, message] };
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearMessages: () =>
    set({
      messages: [],
      topicProgress: {
        currentTopicId: null,
        completedTopics: [],
        subtopicProgress: {},
        understanding: "not_started",
      },
    }),

  setCurrentTopic: (topicId) =>
    set((state) => {
      // Find the topic in PYTHON_TOPICS
      const topic = Object.values(PYTHON_TOPICS)
        .flatMap((section) => section.topics)
        .find((t) => t.id === topicId);

      if (!topic) return state;

      // Initialize subtopic progress if not exists
      const existingProgress =
        state.topicProgress.subtopicProgress[topicId] || [];
      const newSubtopics = topic.subtopics
        .filter((st) => !existingProgress.find((ep) => ep.name === st))
        .map((st) => ({ name: st, completed: false }));

      return {
        topicProgress: {
          ...state.topicProgress,
          currentTopicId: topicId,
          understanding: "learning",
          subtopicProgress: {
            ...state.topicProgress.subtopicProgress,
            [topicId]: [...existingProgress, ...newSubtopics],
          },
        },
      };
    }),

  updateSubtopicProgress: (topicId, subtopicName, completed) =>
    set((state) => {
      const topicSubtopics =
        state.topicProgress.subtopicProgress[topicId] || [];
      const updatedSubtopics = topicSubtopics.map((st) =>
        st.name === subtopicName ? { ...st, completed } : st
      );

      // Check if all subtopics are completed
      const allCompleted = updatedSubtopics.every((st) => st.completed);
      const completedTopics =
        allCompleted && !state.topicProgress.completedTopics.includes(topicId)
          ? [...state.topicProgress.completedTopics, topicId]
          : state.topicProgress.completedTopics;

      return {
        topicProgress: {
          ...state.topicProgress,
          completedTopics,
          subtopicProgress: {
            ...state.topicProgress.subtopicProgress,
            [topicId]: updatedSubtopics,
          },
        },
      };
    }),

  setUnderstanding: (level) =>
    set((state) => ({
      topicProgress: {
        ...state.topicProgress,
        understanding: level,
      },
    })),

  moveToNextTopic: () => {
    const state = get();
    const { currentTopicId } = state.topicProgress;

    const allTopics = Object.values(PYTHON_TOPICS).flatMap(
      (section) => section.topics
    );

    const currentIndex = allTopics.findIndex((t) => t.id === currentTopicId);
    if (currentIndex === -1 || currentIndex === allTopics.length - 1)
      return null;

    const nextTopic = allTopics[currentIndex + 1];
    state.setCurrentTopic(nextTopic.id);
    return nextTopic.id;
  },

  getProgress: () => {
    const state = get();

    let completedSubtopics = 0;
    let totalSubtopics = 0;

    Object.entries(state.topicProgress.subtopicProgress).forEach(
      ([, subtopics]) => {
        completedSubtopics += subtopics.filter((st) => st.completed).length;
        totalSubtopics += subtopics.length;
      }
    );

    const overallProgress =
      totalSubtopics > 0 ? (completedSubtopics / totalSubtopics) * 100 : 0;

    const topicProgress = state.topicProgress.currentTopicId
      ? ((state.topicProgress.subtopicProgress[
          state.topicProgress.currentTopicId
        ]?.filter((st) => st.completed).length || 0) /
          (state.topicProgress.subtopicProgress[
            state.topicProgress.currentTopicId
          ]?.length || 1)) *
        100
      : 0;

    return {
      topicProgress,
      overallProgress,
      completedSubtopics,
      totalSubtopics,
    };
  },
}));
