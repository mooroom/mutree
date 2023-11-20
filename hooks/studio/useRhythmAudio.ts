import React from 'react';
import { MutreeAudio, MutreeAudioMap, MutreeAudioName } from '@/types/studio';
import rhythmAudioData from './rhythmAudio.json';
import { SamplerOptions, Frequency } from 'tone';
import MutreeInstrument from '@/classes/MutreeInstrument';
import type { Note } from 'tone/build/esm/core/type/Units';

const getRhythmAudioOptions = (
  note: string,
  audioName: string,
  errorCallback: () => void
): Partial<SamplerOptions> => {
  return {
    release: 1,
    baseUrl: rhythmAudioData.baseUrl,
    urls: {
      [note]: `${audioName}/${note}.mp3`,
    },
    // onload: () => console.log(`loaded: ${audioName}/${note}.mp3`),
    onerror: () => {
      console.log(`error loading: ${audioName}/${note}.mp3`);
      errorCallback();
    },
  };
};

export default function useRhythmAudio() {
  const audioMapRef = React.useRef<MutreeAudioMap>({});
  const [isAudioLoaded, setIsAudioLoaded] = React.useState(false);

  const [audioNameList] = React.useState<MutreeAudioName[]>(rhythmAudioData.audioList);
  const [selectedAudioName, setSelectedAudioName] = React.useState<MutreeAudioName>(
    rhythmAudioData.audioList[0]
  );

  const handleAudioNameChange = React.useCallback(
    (audioName: MutreeAudioName) => {
      setSelectedAudioName(audioName);
    },
    [setSelectedAudioName]
  );

  React.useEffect(() => {
    const audioList = rhythmAudioData.audioList;

    const audioMap: MutreeAudioMap = {};

    for (const audioName of audioList) {
      const audio: MutreeAudio = {};

      const notes = ['C0', 'D0', 'E0', 'F0', 'G0', 'A0', 'B0'].reverse() as Note[];

      for (const note of notes) {
        const midiNote = Frequency(note).toMidi();
        audio[midiNote] = new MutreeInstrument(
          note,
          getRhythmAudioOptions(note, audioName.value, () => {
            audio[midiNote] = null;
          })
        ).toDestination();
      }

      audioMap[audioName.value] = audio;
    }
    audioMapRef.current = audioMap;

    const checkAudioLoaded = setInterval(() => {
      const audioMap = audioMapRef.current;
      if (!audioMap) return;

      let isAudioLoaded = true;

      for (const audio of Object.values(audioMap)) {
        for (const inst of Object.values(audio)) {
          if (!inst) continue;
          if (!inst.loaded) isAudioLoaded = false;
        }
      }

      if (isAudioLoaded) {
        clearInterval(checkAudioLoaded);
        setIsAudioLoaded(true);
      }
    }, 100);

    return () => {
      for (const audio of Object.values(audioMap)) {
        for (const inst of Object.values(audio)) {
          if (inst) inst.dispose();
        }
      }
    };
  }, []);

  return {
    audioMap: audioMapRef.current,
    isAudioLoaded,
    audioNameList,
    selectedAudioName,
    handleAudioNameChange,
  };
}
