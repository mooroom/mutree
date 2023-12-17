import React from 'react';
import { SamplerOptions, Frequency } from 'tone';
import type { Note } from 'tone/build/esm/core/type/Units';
import { MutreeAudio, MutreeAudioMap, MutreeAudioName } from '@/types/studio';
import rhythmAudioData from './rhythmAudio.json';
import MutreeInstrument from '@/classes/MutreeInstrument';
import 'regenerator-runtime/runtime'; // Add import statement for regenerator-runtime

const getRhythmAudioOptions = (
  note: string,
  audioName: string,
  errorCallback: () => void
): Partial<SamplerOptions> => ({
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
});

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
    const { audioList } = rhythmAudioData;

    const audioMap: MutreeAudioMap = {};

    audioList.forEach((audioName) => {
      const audio: MutreeAudio = {};

      const notes = ['C0', 'D0', 'E0', 'F0', 'G0', 'A0', 'B0'].reverse() as Note[];

      notes.forEach((note) => {
        const midiNote = Frequency(note).toMidi();
        audio[midiNote] = new MutreeInstrument(
          note,
          getRhythmAudioOptions(note, audioName.value, () => {
            audio[midiNote] = null;
          })
        ).toDestination();
      });

      audioMap[audioName.value] = audio;
    });
    audioMapRef.current = audioMap;

    const checkAudioLoaded = setInterval(() => {
      const am = audioMapRef.current;
      if (!am) return;

      let isLoaded = true;

      Object.values(am).forEach((audio) => {
        Object.values(audio).forEach((inst) => {
          if (inst && !inst.loaded) {
            isLoaded = false;
          }
        });
      });

      if (isLoaded) {
        clearInterval(checkAudioLoaded);
        setIsAudioLoaded(true);
      }
    }, 100);

    return () =>
      Object.values(audioMap).forEach((audio) => {
        Object.values(audio).forEach((inst) => {
          if (inst) inst.dispose();
        });
      });
  }, []);

  return {
    audioMap: audioMapRef.current,
    isAudioLoaded,
    audioNameList,
    selectedAudioName,
    handleAudioNameChange,
  };
}
