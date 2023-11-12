import React from 'react';
import { isToneInitializedAtom, playAtom, timeAtom } from '@/atoms/studio';
import { useRecoilState } from 'recoil';
import { formatTimer } from '@/utils/studio';
import * as Tone from 'tone';

export default function useTimer() {
  const [isToneInitialized, setIsToneInitialized] = useRecoilState(isToneInitializedAtom);
  const [time, setTime] = useRecoilState(timeAtom);
  const [playState, setPlayState] = useRecoilState(playAtom);

  React.useEffect(() => {
    let timerId: number | undefined;

    if (playState === 'started') {
      const startTime = Tone.now() - time;

      timerId = Tone.Transport.scheduleRepeat(() => {
        const elapsedTime = Tone.now() - startTime;
        setTime(elapsedTime);
      }, 0.01);
    } else {
      if (timerId !== undefined) {
        Tone.Transport.clear(timerId);
      }
    }

    return () => {
      if (timerId !== undefined) {
        Tone.Transport.clear(timerId);
      }
    };
  }, [playState, time, setTime]);

  const formattedTime = React.useMemo(() => {
    return formatTimer(time);
  }, [time]);

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
  }, [setPlayState, setTime]);

  return {
    time,
    formattedTime,
    playState,
    togglePlay,
    stop,
  };
}
