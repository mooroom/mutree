import { RESOLUTIONS } from '@/constants/studio';

export type PlayState = 'started' | 'stopped' | 'paused';
export type Resolution = (typeof RESOLUTIONS)[number];
