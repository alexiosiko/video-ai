// Shared types for video processor components

export interface FormData {
  youtubeUrl: string;
  clipDuration: number;
  numberOfReels: number;
  subtitleStyle: 'modern' | 'bold' | 'neon' | 'classic';
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
}

export interface GeneratedReel {
  id?: string;
  filename?: string;
  downloadUrl?: string;
  duration?: number;
  keywords?: string[];
  transcript?: string;
}

export interface PresetConfig {
  clipDuration: number;
  numberOfReels: number;
  subtitleStyle: 'modern' | 'bold' | 'neon' | 'classic';
}

export type PresetKey = 'viral' | 'educational' | 'comedy' | 'highlights';