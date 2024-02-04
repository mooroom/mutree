import { Volume } from 'tone';
// import MutreeEvent from '@/classes/MutreeEvent';
import MutreeInstrument from '@/classes/MutreeInstrument';
import {
  DENOMINATORS,
  MOUSE_CONTROL_OPTIONS,
  NUMERATORS,
  RESOLUTIONS,
  SCALE_NAMES,
} from '@/constants/studio';

export type Layer = 'rhythm' | 'melody';

export type PlayState = 'started' | 'stopped' | 'paused';
export type Resolution = (typeof RESOLUTIONS)[number];

export type Numerator = (typeof NUMERATORS)[number];
export type Denominator = (typeof DENOMINATORS)[number];

export type ScaleName = (typeof SCALE_NAMES)[number];
export interface MutreeKey {
  pitch: number;
  noteName: {
    ko: string;
    en: string;
  };
  iconUrl?: string;
}

export type MutreeAudio = Record<number, MutreeInstrument | null>;

export type MutreeAudioMap = Record<string, MutreeAudio>;
export type MutreeVolumeMap = Record<string, Volume>;

export type MutreeAudioName = {
  label: string;
  value: string;
};

export interface MutreeNote {
  id: string;
  x: number;
  y: number;
  length: number;
  isSelected: boolean;
  isAI?: boolean;
}

export type MouseControl = keyof typeof MOUSE_CONTROL_OPTIONS;
