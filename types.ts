import React from 'react';

export interface NavigationItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  path: string;
  category: 'Calculator' | 'Analysis' | 'Planning';
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface LearningArticle {
  id: string;
  title: string;
  summary: string;
  content: string; // In a real app, this might be Markdown
  date: string;
  author: string;
}

export interface WeibullDataPoint {
  time: number;
  rank?: number;
  medianRank?: number;
}

export interface WeibullResult {
  beta: number; // Shape
  eta: number;  // Scale
  rSquared: number;
  points: WeibullDataPoint[];
  linePoints: { time: number; medianRank: number }[];
  b10: number;
}

export enum RBDBlockType {
  SERIES = 'SERIES',
  PARALLEL = 'PARALLEL'
}

export interface RBDBlock {
  id: string;
  name: string;
  reliability: number; // 0-1
}

export interface PMTask {
  id: string;
  name: string;
  intervalDays: number;
  lastPerformed: string; // YYYY-MM-DD
  nextDue?: string;
}