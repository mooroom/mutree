import * as Tone from 'tone';
import { Scale } from 'tonal';
import * as mm from '@magenta/music';
import {
  KO_NOTE_NAME,
  ROOT_NOTES,
  TOTAL_STEPS,
  TOTAL_WIDTH,
  SCALE_NAMES,
} from '@/constants/studio';
import { ScaleName, MutreeNote, MutreeKey } from '@/types/studio';
import basicRhythmIconsIndexJson from '@/public/studio/images/rhythmIcons/basic/_index.json';

// time utils
export function formatTimer(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor(time * 10) % 10;

  const minutesString = minutes.toString().padStart(2, '0');
  const secondsString = seconds.toString().padStart(2, '0');

  return `${minutesString}:${secondsString}.${milliseconds}`;
}

export function getDurationOfSixteenth(bpm: number) {
  return 1 / ((bpm / 60) * 4);
}

export function getAbsoluteScrollLeftPosition(bpm: number) {
  const currentTime = Tone.Transport.seconds;
  const totalTime = TOTAL_STEPS * getDurationOfSixteenth(bpm);

  return (currentTime / totalTime) * TOTAL_WIDTH;
}

// scale utils

export function getMelodyKeys(root: number, scaleName: ScaleName) {
  const rootNote = ROOT_NOTES[scaleName][root];
  const scale = Scale.rangeOf(`${rootNote} ${scaleName}`)(`${rootNote}5`, `${rootNote}2`);

  return scale.map((value: string | undefined) => {
    const pitch = Tone.Frequency(value).toMidi();

    return {
      pitch,
      noteName: {
        ko: `${KO_NOTE_NAME[value![0]]}${value![1]}${value![2] ?? ''}`,
        en: value!,
      },
    };
  });
}

export function getRhythmKeys(): MutreeKey[] {
  const notes = ['C0', 'D0', 'E0', 'F0', 'G0', 'A0', 'B0'].reverse();

  return notes.map((value: string) => {
    const pitch = Tone.Frequency(value).toMidi();
    const parsedJson = basicRhythmIconsIndexJson as {
      [key: string]: { path: string; name: { [key: string]: string } };
    };

    return {
      pitch,
      iconUrl: parsedJson[value!].path,
      noteName: {
        ko: parsedJson[value!].name.ko,
        en: parsedJson[value!].name.en,
      },
    };
  });
}

export const convertToINoteSequence = (
  mutreeNotes: MutreeNote[],
  keys: MutreeKey[],
  totalQuantizedSteps: number
) => {
  const notes = mutreeNotes.map((note) => ({
    pitch: keys[note.y].pitch,
    quantizedStartStep: note.x,
    quantizedEndStep: note.x + note.length,
    program: 0,
  }));

  const noteSequence: mm.INoteSequence = {
    notes,
    quantizationInfo: {
      stepsPerQuarter: 4,
    },
    totalQuantizedSteps,
  };

  return noteSequence;
};

export const makeUrlFromLocalStorage = () => {
  const melodyMutreeNotes = localStorage.getItem('melody-roll-notes');
  const rhythmMutreeNotes = localStorage.getItem('rhythm-roll-notes');

  // parse array data and encode
  const encodedMelody = melodyMutreeNotes ? btoa(melodyMutreeNotes) : btoa('[]');
  const encodedRhythm = rhythmMutreeNotes ? btoa(rhythmMutreeNotes) : btoa('[]');

  // make url
  const url = `${window.location.origin}/studio?melody=${encodedMelody}&rhythm=${encodedRhythm}`;

  return url;
};

export function getSelectOptionsScaleName() {
  return SCALE_NAMES.map((value) => ({
    value,
    label: value === 'major' ? '장조' : '단조',
  }));
}

export function getSelectOptionsRootNote(scaleName: ScaleName) {
  const rootNotes = ROOT_NOTES[scaleName];

  return rootNotes.map((value, index) => ({
    value: index.toString(),
    label: `${KO_NOTE_NAME[value[0]]}${value[1] ?? ''}${value[2] ?? ''}`,
  }));
}
