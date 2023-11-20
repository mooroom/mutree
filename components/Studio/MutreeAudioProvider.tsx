import useMelodyAudio from '@/hooks/studio/useMelodyAudio';
import useRhythmAudio from '@/hooks/studio/useRhythmAudio';
import { MutreeAudioMap, MutreeAudioName } from '@/types/studio';
import React from 'react';

type ContextType = {
  melodyAudioMap: MutreeAudioMap;
  melodyAudioNameList: MutreeAudioName[];
  selectedMelodyAudioName: MutreeAudioName;
  handleMelodyAudioNameChange: (value: MutreeAudioName) => void;

  rhythmAudioMap: MutreeAudioMap;
  rhythmAudioNameList: MutreeAudioName[];
  selectedRhythmAudioName: MutreeAudioName;
  handleRhythmAudioNameChange: (value: MutreeAudioName) => void;

  isAudioLoaded: boolean;
};

const MutreeAudioContext = React.createContext<ContextType>({} as ContextType);

export default function MutreeAudioProvider({ children }: { children: React.ReactNode }) {
  const {
    audioMap: melodyAudioMap,
    isAudioLoaded: isMelodyAudioLoaded,
    audioNameList: melodyAudioNameList,
    selectedAudioName: selectedMelodyAudioName,
    handleAudioNameChange: handleMelodyAudioNameChange,
  } = useMelodyAudio();

  const {
    audioMap: rhythmAudioMap,
    isAudioLoaded: isRhythmAudioLoaded,
    audioNameList: rhythmAudioNameList,
    selectedAudioName: selectedRhythmAudioName,
    handleAudioNameChange: handleRhythmAudioNameChange,
  } = useRhythmAudio();

  return (
    <MutreeAudioContext.Provider
      value={{
        melodyAudioMap,
        melodyAudioNameList,
        selectedMelodyAudioName,
        handleMelodyAudioNameChange,

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
