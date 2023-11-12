import { atom, selector } from 'recoil';
import * as IStudio from '@/types/studio';
import * as Tone from 'tone';

export const isToneInitializedAtom = atom<boolean>({
  key: 'isToneInitializedAtom',
  default: false,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue) {
          Tone.start();
        }
      });
    },
  ],
});

export const playAtom = atom<IStudio.PlayState>({
  key: 'playAtom',
  default: 'stopped',
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        if (newValue === 'started') {
          Tone.Transport.start();
        } else if (newValue === 'stopped') {
          Tone.Transport.stop();
        } else if (newValue === 'paused') {
          Tone.Transport.pause();
        }
      });
    },
  ],
});

export const timeAtom = atom<number>({
  key: 'timeAtom',
  default: 0,
});

export const scrollLeftAtom = atom<number>({
  key: 'scrollLeftAtom',
  default: 0,
});

export const isScrollingAtom = atom<boolean>({
  key: 'isScrollingAtom',
  default: false,
});
