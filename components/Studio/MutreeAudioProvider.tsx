import useMelodyAudio from '@/hooks/studio/useMelodyAudio';
import { MutreeAudioMap, MutreeAudioName } from '@/types/studio';
import React from 'react';

type ContextType = {
  melodyAudioMap: MutreeAudioMap;
  melodyAudioNameList: MutreeAudioName[];
  selectedMelodyAudioName: MutreeAudioName;
  handleMelodyAudioNameChange: (value: MutreeAudioName) => void;
  rhythmAudioMap: MutreeAudioMap;
  // rhythmAudioNameList: MutreeAudioName[];
  // selectedRhythmAudioName: MutreeAudioName;
  // setSelectedRhythmAudioName: React.Dispatch<React.SetStateAction<MutreeAudioName>>;
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

  return (
    <MutreeAudioContext.Provider
      value={{
        melodyAudioMap,
        melodyAudioNameList,
        selectedMelodyAudioName,
        handleMelodyAudioNameChange,

        rhythmAudioMap: {},
        isAudioLoaded: isMelodyAudioLoaded,
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
