import { Resolution } from '@/types/studio';

export const RESOLUTIONS = ['4n', '8n', '16n'] as const;

export const NOTE_WIDTH: Record<Resolution, number> = {
  '4n': 80,
  '8n': 40,
  '16n': 20,
};

export const NUMERATORS = [2, 3, 4, 6, 8, 9, 12] as const;
export const DENOMINATORS = [4, 8] as const;

export const TOTAL_STEPS = 600;
export const STEP_WIDTH = 20;
export const TOTAL_WIDTH = STEP_WIDTH * TOTAL_STEPS;

export const MELODY_UNIT_NUM = 22;
export const MELODY_UNIT_HEIGHT = 30;

export const RHYTHM_UNIT_NUM = 7;
export const RHYTHM_UNIT_HEIGHT = 50;

export const SCALE_NAMES = ['major', 'minor'] as const;

export const MAJOR_ROOT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const MINOR_ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

export const ROOT_NOTES: Record<(typeof SCALE_NAMES)[number], string[]> = {
  major: MAJOR_ROOT_NOTES,
  minor: MINOR_ROOT_NOTES,
};

export const KO_NOTE_NAME: { [key: string]: string } = {
  C: '도',
  D: '레',
  E: '미',
  F: '파',
  G: '솔',
  A: '라',
  B: '시',
};
