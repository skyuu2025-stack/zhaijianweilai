
export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  image?: {
    data: string;
    mimeType: string;
  };
  sources?: { uri: string; title: string }[];
  timestamp: number;
}

export enum AppTab {
  HOME = 'home',
  CHAT = 'chat',
  HEAL = 'heal',
  ASSETS = 'assets',
  TOOLS = 'tools',
  PRO = 'pro'
}

export interface FinancialItem {
  id: string;
  name: string;
  value: number;
  type: 'asset' | 'liability' | 'income' | 'expense';
  interestRate?: number; // 年利率 %
}

export interface DiaryEntry {
  id: string;
  mood: string;
  content: string;
  timestamp: number;
  aiResponse?: string;
}

export interface UserStatus {
  isPro: boolean;
  isLifetimeFree?: boolean; // 灯塔女神赠予的永久权益
  tier?: string;
  referralCount: number; // 裂变分享计数
  lastDrawMonth?: string; // 记录上一次抽奖的月份 (YYYY-MM)
}

export interface HabitItem {
  id: string;
  task: string;
  completed: boolean;
}
