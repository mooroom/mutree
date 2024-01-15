import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import * as Tone from 'tone';
import { isToneInitializedAtom, playStateAtom, scrollLeftAtom, timeAtom } from '@/atoms/studio';
import { formatTimer } from '@/utils/studio';

export default function usePlayControls() {
  const [isToneInitialized, setIsToneInitialized] = useRecoilState(isToneInitializedAtom);
  const [time, setTime] = useRecoilState(timeAtom);
  const [playState, setPlayState] = useRecoilState(playStateAtom);
  const setScrollLeft = useSetRecoilState(scrollLeftAtom);

  React.useEffect(() => {
    let timerId: number | undefined;

    if (playState === 'started') {
      timerId = Tone.Transport.scheduleRepeat(() => {
        setTime(Tone.Transport.seconds);
      }, 0.01);
    } else if (playState === 'paused') {
      Tone.Transport.pause();
    } else if (playState === 'stopped') {
      Tone.Transport.stop();
    }

    return () => {
      if (timerId !== undefined) {
        Tone.Transport.clear(timerId);
      }
    };
  }, [playState, time, setTime]);

  const formattedTime = React.useMemo(() => formatTimer(time), [time]);

  const togglePlay = React.useCallback(() => {
    if (!isToneInitialized) {
      Tone.start();
      setIsToneInitialized(true);
    }

    if (playState === 'started') {
      setPlayState('paused');
    } else {
      setPlayState('started');
    }
  }, [playState, setPlayState, isToneInitialized, setIsToneInitialized]);

  const stop = React.useCallback(() => {
    setPlayState('stopped');
    setTime(0);
    setScrollLeft(0);
  }, [setPlayState, setTime, setScrollLeft]);

  return {
    formattedTime,
    playState,
    togglePlay,
    stop,
  };
}
