// src/lib/constants.ts

// Maximum messages in a conversation
export const MAX_MESSAGES = 20;

// Detailed Python OOP Topics structure
export const PYTHON_TOPICS = {
  BASICS: {
    title: 'Basic OOP Concepts',
    topics: [
      {
        id: 'classes_objects',
        title: 'Classes and Objects',
        subtopics: ['Class Definition', 'Object Instantiation', 'self Parameter']
      },
      {
        id: 'attributes_methods',
        title: 'Attributes and Methods',
        subtopics: ['Instance Attributes', 'Instance Methods', 'Class Attributes']
      }
    ]
  },
  INTERMEDIATE: {
    title: 'Intermediate Concepts',
    topics: [
      {
        id: 'inheritance',
        title: 'Inheritance',
        subtopics: ['Single Inheritance', 'Method Overriding', 'super() Function']
      },
      {
        id: 'encapsulation',
        title: 'Encapsulation',
        subtopics: ['Private Attributes', 'Property Decorators', 'Getter/Setter Methods']
      },
      {
        id: 'polymorphism',
        title: 'Polymorphism',
        subtopics: ['Method Overriding', 'Duck Typing', 'Operator Overloading']
      }
    ]
  },
  ADVANCED: {
    title: 'Advanced Concepts',
    topics: [
      {
        id: 'special_methods',
        title: 'Special Methods',
        subtopics: ['__init__', '__str__', '__repr__', '__len__', '__call__']
      },
      {
        id: 'multiple_inheritance',
        title: 'Multiple Inheritance',
        subtopics: ['MRO (Method Resolution Order)', 'Diamond Problem', 'Mixins']
      },
      {
        id: 'metaclasses',
        title: 'Metaclasses',
        subtopics: ['Class Creation', 'Class Customization', 'Abstract Base Classes']
      }
    ]
  },
  DESIGN_PATTERNS: {
    title: 'Design Patterns',
    topics: [
      {
        id: 'creational',
        title: 'Creational Patterns',
        subtopics: ['Singleton', 'Factory Method', 'Abstract Factory']
      },
      {
        id: 'structural',
        title: 'Structural Patterns',
        subtopics: ['Adapter', 'Decorator', 'Facade']
      },
      {
        id: 'behavioral',
        title: 'Behavioral Patterns',
        subtopics: ['Observer', 'Strategy', 'Command']
      }
    ]
  },
  BEST_PRACTICES: {
    title: 'Best Practices',
    topics: [
      {
        id: 'solid_principles',
        title: 'SOLID Principles',
        subtopics: [
          'Single Responsibility',
          'Open/Closed',
          'Liskov Substitution',
          'Interface Segregation',
          'Dependency Inversion'
        ]
      },
      {
        id: 'code_organization',
        title: 'Code Organization',
        subtopics: ['Module Structure', 'Package Organization', 'Import Management']
      }
    ]
  }
} as const;

// Helper type for topic tracking
export type TopicKey = keyof typeof PYTHON_TOPICS;
export type TopicStatus = 'not-started' | 'in-progress' | 'completed';

// Progress tracking interface
export interface TopicProgress {
  id: string;
  status: TopicStatus;
  completedSubtopics: string[];
}

// Helper functions for topics
export const getAllTopics = () => {
  return Object.values(PYTHON_TOPICS).flatMap(section => 
    section.topics.map(topic => ({
      ...topic,
      section: section.title
    }))
  );
};

export const getTopicById = (topicId: string) => {
  for (const section of Object.values(PYTHON_TOPICS)) {
    const topic = section.topics.find(t => t.id === topicId);
    if (topic) return { ...topic, section: section.title };
  }
  return null;
};

// System Messages
export const SYSTEM_MESSAGES = {
  WELCOME: `Welcome to the Python OOP Tutorial! We'll start with the basics and progressively move to more advanced concepts. What would you like to learn about first?`,
  TOPIC_COMPLETED: `Great job! You've completed this topic. Would you like to move on to the next one?`,
  ERROR: `I apologize, but I encountered an error. Let's try that again.`,
  // SESSION_LIMIT: `You've reached the session limit of ${MAX_MESSAGES} messages. Would you like to start a new session?`
};

// API Configuration
export const API_CONFIG = {
  baseUrl: '/pages/api',
  endpoints: {
    chat: '/chat'
  },
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 1000
};