import React from 'react';
import useMelodyAudio from '@/hooks/studio/useMelodyAudio';
import useRhythmAudio from '@/hooks/studio/useRhythmAudio';
import { MutreeAudioMap, MutreeAudioName, MutreeVolumeMap } from '@/types/studio';

type ContextType = {
  melodyAudioMap: MutreeAudioMap;
  melodyVolumeMap: MutreeVolumeMap;
  melodyAudioNameList: MutreeAudioName[];
  selectedMelodyAudioName: MutreeAudioName;
  handleMelodyAudioNameChange: (value: MutreeAudioName) => void;

  rhythmAudioMap: MutreeAudioMap;
  rhythmVolumeMap: MutreeVolumeMap;
  rhythmAudioNameList: MutreeAudioName[];
  selectedRhythmAudioName: MutreeAudioName;
  handleRhythmAudioNameChange: (value: MutreeAudioName) => void;

  isAudioLoaded: boolean;
};

const MutreeAudioContext = React.createContext<ContextType>({} as ContextType);

export default function MutreeAudioProvider({ children }: { children: React.ReactNode }) {
  const {
    audioMap: melodyAudioMap,
    volumeMap: melodyVolumeMap,
    isAudioLoaded: isMelodyAudioLoaded,
    audioNameList: melodyAudioNameList,
    selectedAudioName: selectedMelodyAudioName,
    handleAudioNameChange: handleMelodyAudioNameChange,
  } = useMelodyAudio();

  const {
    audioMap: rhythmAudioMap,
    volumeMap: rhythmVolumeMap,
    isAudioLoaded: isRhythmAudioLoaded,
    audioNameList: rhythmAudioNameList,
    selectedAudioName: selectedRhythmAudioName,
    handleAudioNameChange: handleRhythmAudioNameChange,
  } = useRhythmAudio();

  return (
    <MutreeAudioContext.Provider
      value={{
        melodyVolumeMap,
        melodyAudioMap,
        melodyAudioNameList,
        selectedMelodyAudioName,
        handleMelodyAudioNameChange,

        rhythmVolumeMap,
        rhythmAudioMap,
        rhythmAudioNameList,
        selectedRhythmAudioName,
        handleRhythmAudioNameChange,

        isAudioLoaded: isMelodyAudioLoaded && isRhythmAudioLoaded,
      }}
    >
      {children}
    </MutreeAudioContext.Provider>
  );
}

export function useMutreeAudioContext() {
  const context = React.useContext(MutreeAudioContext);

  if (!context) {
    throw new Error('useMutreeAudioContext must be used within a MutreeAudioProvider');
  }

  return context;
}
