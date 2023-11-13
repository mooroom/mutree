import { DENOMINATORS, NUMERATORS, RESOLUTIONS } from '@/constants/studio';

export type PlayState = 'started' | 'stopped' | 'paused';
export type Resolution = (typeof RESOLUTIONS)[number];

export type Numerator = (typeof NUMERATORS)[number];
export type Denominator = (typeof DENOMINATORS)[number];
