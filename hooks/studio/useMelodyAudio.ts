import React from 'react';
import { MutreeAudio, MutreeAudioMap, MutreeAudioName } from '@/types/studio';
import melodyAudioData from './melodyAudio.json';
import { SamplerOptions, Frequency } from 'tone';
import MutreeInstrument from '@/classes/MutreeInstrument';

const getMelodyAudioOptions = (
  note: string,
  audioName: string,
  errorCallback: () => void
): Partial<SamplerOptions> => ({
  release: 1,
  baseUrl: melodyAudioData.baseUrl,
  urls: {
    [note]: `${audioName}/${note}.mp3`,
  },
  // onload: () => console.log(`loaded: ${audioName}/${note}.mp3`),
  onerror: () => {
    // console.log(`error loading: ${audioName}/${note}.mp3`);
    errorCallback();
  },
});

export default function useMelodyAudio() {
  const audioMapRef = React.useRef<MutreeAudioMap>({});
  const [isAudioLoaded, setIsAudioLoaded] = React.useState(false);

  const [audioNameList] = React.useState<MutreeAudioName[]>(melodyAudioData.audioList);
  const [selectedAudioName, setSelectedAudioName] = React.useState<MutreeAudioName>(
    melodyAudioData.audioList[0]
  );

  const handleAudioNameChange = React.useCallback(
    (audioName: MutreeAudioName) => {
      setSelectedAudioName(audioName);
    },
    [setSelectedAudioName]
  );

  React.useEffect(() => {
    const audioList = melodyAudioData.audioList;

    const audioMap: MutreeAudioMap = {};

    for (const audioName of audioList) {
      const audio: MutreeAudio = {};

      //C2 ~ C5
      const startMidiNote = 36;
      const endMidiNote = 72;

      for (let i = startMidiNote; i <= endMidiNote; i++) {
        const note = Frequency(i, 'midi').toNote();

        audio[i] = new MutreeInstrument(
          note,
          getMelodyAudioOptions(note, audioName.value, () => {
            audio[i] = null;
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
