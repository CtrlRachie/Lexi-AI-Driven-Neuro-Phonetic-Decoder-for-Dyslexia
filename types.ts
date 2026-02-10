
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  READING = 'READING',
  VISION = 'VISION',
  MNEMONICS = 'MNEMONICS',
  PARENT_REPORT = 'PARENT_REPORT'
}

export type DifficultyLevel = 'Seedling' | 'Sprout' | 'Blossom';

export interface PhoneticError {
  phoneme: string;
  count: number;
  examples: string[];
}

export interface DailyProgress {
  day: string;
  stars: number;
  accuracy: number;
}

export interface UserStats {
  stars: number;
  level: number;
  wordsRead: number;
  accuracy: number;
  difficulty: DifficultyLevel;
  commonErrors: PhoneticError[];
  weeklyHistory: DailyProgress[];
}

export interface MnemonicCard {
  word: string;
  imageUrl: string;
  explanation: string;
}

export interface TranscriptionItem {
  text: string;
  sender: 'user' | 'lexi';
}
