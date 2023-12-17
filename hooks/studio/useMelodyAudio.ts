import React from 'react';
import { SamplerOptions, Frequency } from 'tone';
import { MutreeAudio, MutreeAudioMap, MutreeAudioName } from '@/types/studio';
import melodyAudioData from './melodyAudio.json';
import MutreeInstrument from '@/classes/MutreeInstrument';

const getMelodyAudioOptions = (
  note: string,
  audioName: string,
  errorCallback: () => void
): Partial<SamplerOptions> => {
  const isSharp = note.includes('#');
  const isFlat = note.includes('b');

  const noteName = isSharp ? `${note[0]}s${note[2]}` : isFlat ? `${note[0]}b${note[2]}` : note;

  return {
    release: 1,
    baseUrl: melodyAudioData.baseUrl,
    urls: {
      [note]: `${audioName}/${noteName}.mp3`,
    },
    // onload: () => console.log(`loaded: ${audioName}/${note}.mp3`),
    onerror: () => {
      console.log(`error loading: ${audioName}/${note}.mp3`);
      errorCallback();
    },
  };
};

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
    const { audioList } = melodyAudioData;

    const audioMap: MutreeAudioMap = {};

    Array.from(audioList).forEach((audioName) => {
      const audio: MutreeAudio = {};

      //C2 ~ C5
      const startMidiNote = 36;
      const endMidiNote = 72;

      Array.from({ length: endMidiNote - startMidiNote + 1 }).map((_, index) => {
        const i = startMidiNote + index;
        const note = Frequency(i, 'midi').toNote();
        audio[i] = new MutreeInstrument(
          note,
          getMelodyAudioOptions(note, audioName.value, () => {
            audio[i] = null;
          })
        ).toDestination();
        return null; // Add a return statement here
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

    return () => {
      Object.values(audioMap).forEach((audio) => {
        Object.values(audio).forEach((inst) => {
          if (inst) inst.dispose();
        });
      });
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
