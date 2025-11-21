export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  attachment?: {
    mimeType: string;
    data: string; // Base64 string
  };
  isError?: boolean;
}

export interface GeminiConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
}