import { DENOMINATORS, NUMERATORS, RESOLUTIONS, SCALE_NAMES } from '@/constants/studio';

export type PlayState = 'started' | 'stopped' | 'paused';
export type Resolution = (typeof RESOLUTIONS)[number];

export type Numerator = (typeof NUMERATORS)[number];
export type Denominator = (typeof DENOMINATORS)[number];

export type ScaleName = (typeof SCALE_NAMES)[number];
