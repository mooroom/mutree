import { atom, selector } from 'recoil';
import * as Tone from 'tone';
import * as IStudio from '@/types/studio';
import { getMelodyKeys, getRhythmKeys } from '@/utils/studio';

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

export const playStateAtom = atom<IStudio.PlayState>({
  key: 'playStateAtom',
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

export const isPlayheadInvisibleAtom = atom<boolean>({
  key: 'isPlayheadInvisibleAtom',
  default: false,
});

export const bpmAtom = atom<number>({
  key: 'bpmAtom',
  default: 120,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue) => {
        Tone.Transport.bpm.value = newValue;
      });
    },
  ],
});

export const numerAtom = atom<IStudio.Numerator>({
  key: 'numerAtom',
  default: 6,
});

export const denomAtom = atom<IStudio.Denominator>({
  key: 'denomAtom',
  default: 8,
});

export const resolutionAtom = atom<IStudio.Resolution>({
  key: 'resolutionAtom',
  default: '16n',
});

export const melodyRootNoteAtom = atom({
  key: 'rootNoteAtom',
  default: 0,
});

export const melodyScaleNameAtom = atom<IStudio.ScaleName>({
  key: 'scaleNameAtom',
  default: 'major',
});

export const melodyKeysAtom = selector<IStudio.MutreeKey[]>({
  key: 'melodyKeysAtom',
  get: ({ get }) => {
    const rootNote = get(melodyRootNoteAtom);
    const scaleName = get(melodyScaleNameAtom);

    return getMelodyKeys(rootNote, scaleName);
  },
});

export const rhythmKeysAtom = atom<IStudio.MutreeKey[]>({
  key: 'rhythmKeysAtom',
  default: getRhythmKeys(),
});

export const generateMelodyTriggeredAtom = atom<boolean>({
  key: 'generateMelodyTriggeredAtom',
  default: false,
});

export const melodyRollNotesAtom = atom<IStudio.RollNote[]>({
  key: 'melodyRollNotesAtom',
  default: [],
});

export const rhythmRollNotesAtom = atom<IStudio.RollNote[]>({
  key: 'rhythmRollNotesAtom',
  default: [],
});
