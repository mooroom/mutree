import {
  bpmAtom,
  isPlayheadInvisibleAtom,
  isScrollingAtom,
  playStateAtom,
  scrollLeftAtom,
  timeAtom,
} from '@/atoms/studio';
import { getAbsoluteScrollLeftPosition, getDurationOfSixteenth } from '@/utils/studio';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as Tone from 'tone';

export default function useTimeLine() {
  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const [time, setTime] = useRecoilState(timeAtom);
  const bpm = useRecoilValue(bpmAtom);
  const isScrolling = useRecoilValue(isScrollingAtom);
  const playState = useRecoilValue(playStateAtom);
  const setIsPlayheadInvisible = useSetRecoilState(isPlayheadInvisibleAtom);

  const beatRulerRef = React.useRef<HTMLDivElement>(null);
  const playheadRef = React.useRef<HTMLDivElement>(null);

  const jumpToTime = React.useCallback(
    (timelinePosition: number) => {
      const jumpTime = timelinePosition * getDurationOfSixteenth(bpm);
      Tone.Transport.seconds = jumpTime;

      setTime(jumpTime);
    },
    [setTime, bpm]
  );

  React.useEffect(() => {
    const beatRuler = beatRulerRef.current;
    const playhead = playheadRef.current;
    if (!beatRuler || !playhead) return;

    const relativeScrollLeft = getAbsoluteScrollLeftPosition(bpm) - scrollLeft;

    if (relativeScrollLeft < 0 || relativeScrollLeft > beatRuler.clientWidth) {
      setIsPlayheadInvisible(true);
      playhead.style.display = 'none';
    } else {
      setIsPlayheadInvisible(false);
      playhead.style.display = 'block';
    }

    playhead.style.transform = `translateX(${relativeScrollLeft}px)`;

    // scroll to playhead it it's near the edga, only if playState is started and isScrolling is false
    if (
      relativeScrollLeft > beatRuler.clientWidth - 100 &&
      !isScrolling &&
      playState === 'started'
    ) {
      setScrollLeft(scrollLeft + (beatRuler.clientWidth - 200));
    }
  }, [scrollLeft, time, bpm, isScrolling, playState, setScrollLeft, setIsPlayheadInvisible]);

  return {
    beatRulerRef,
    playheadRef,
    jumpToTime,
  };
}
