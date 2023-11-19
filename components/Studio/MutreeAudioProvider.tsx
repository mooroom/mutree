import useMelodyAudio from '@/hooks/studio/useMelodyAudio';
import { MutreeAudioMap } from '@/types/studio';
import React from 'react';

type ContextType = {
  melodyAudioMap: MutreeAudioMap;
  rhythmAudioMap: MutreeAudioMap;
  isAudioLoaded: boolean;
};

const MutreeAudioContext = React.createContext<ContextType>({} as ContextType);

export default function MutreeAudioProvider({ children }: { children: React.ReactNode }) {
  const { audioMap: melodyAudioMap, isAudioLoaded: isMelodyAudioLoaded } = useMelodyAudio();

  return (
    <MutreeAudioContext.Provider
      value={{
        melodyAudioMap,
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
