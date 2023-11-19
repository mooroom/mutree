import MutreeInstrument from '@/classes/MutreeInstrument';
import { DENOMINATORS, NUMERATORS, RESOLUTIONS, SCALE_NAMES } from '@/constants/studio';

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
}

export type MutreeAudio = Record<number, MutreeInstrument | null>;

export type MutreeAudioMap = Record<string, MutreeAudio>;
