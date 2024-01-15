import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as Tone from 'tone';
import {
  isPlayheadInvisibleAtom,
  isScrollingAtom,
  playStateAtom,
  scrollLeftAtom,
  timeAtom,
} from '@/atoms/studio';
import { STEP_WIDTH } from '@/constants/studio';

export default function useTimeLine() {
  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const [time, setTime] = useRecoilState(timeAtom);
  const isScrolling = useRecoilValue(isScrollingAtom);
  const playState = useRecoilValue(playStateAtom);
  const setIsPlayheadInvisible = useSetRecoilState(isPlayheadInvisibleAtom);

  const beatRulerRef = React.useRef<HTMLDivElement>(null);
  const playheadRef = React.useRef<HTMLDivElement>(null);

  const jumpToTime = (timelinePosition: number) => {
    const jumpTime = timelinePosition * Tone.Time('16n').toSeconds();
    Tone.Transport.seconds = jumpTime;

    setTime(jumpTime);
  };

  const animationRef = React.useRef<number | null>(null);

  const animate = React.useCallback(() => {
    const beatRuler = beatRulerRef.current;
    const playhead = playheadRef.current;
    if (!beatRuler || !playhead) return;

    const playheadVelocity = STEP_WIDTH / Tone.Time('16n').toSeconds();
    const absoluteScrollLeftPosition = playheadVelocity * Tone.Transport.seconds;

    const relativeScrollLeft = absoluteScrollLeftPosition - scrollLeft;

    if (relativeScrollLeft < 0 || relativeScrollLeft > beatRuler.clientWidth) {
      setIsPlayheadInvisible(true);
      playhead.style.display = 'none';
    } else {
      setIsPlayheadInvisible(false);
      playhead.style.display = 'block';
    }

    playhead.style.transform = `translateX(${relativeScrollLeft}px)`;

    // scroll to playhead it it's near the edge, only if playState is started and isScrolling is false
    if (
      relativeScrollLeft > beatRuler.clientWidth - 50 &&
      !isScrolling &&
      playState === 'started'
    ) {
      setScrollLeft(scrollLeft + (beatRuler.clientWidth - 100));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isScrolling, playState, scrollLeft, setIsPlayheadInvisible, setScrollLeft]);

  React.useEffect(() => {
    console.log('useTimeLine effect');
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return {
    beatRulerRef,
    playheadRef,
    jumpToTime,
  };
}
