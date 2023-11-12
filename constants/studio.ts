import { Resolution } from '@/types/studio';

export const RESOLUTIONS = ['4n', '8n', '16n'] as const;

export const NOTE_WIDTH: Record<Resolution, number> = {
  '4n': 80,
  '8n': 40,
  '16n': 20,
};

export const TOTAL_STEPS = 600;
export const STEP_WIDTH = 20;
export const TOTAL_WIDTH = STEP_WIDTH * TOTAL_STEPS;
