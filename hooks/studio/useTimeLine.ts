import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import * as Tone from 'tone';
import {
  isPlayheadInvisibleAtom,
  isScrollingAtom,
  playStateAtom,
  scrollLeftAtom,
  timeAtom,
  isToneInitializedAtom,
} from '@/atoms/studio';
import { STEP_WIDTH } from '@/constants/studio';

export default function useTimeLine() {
  const [isToneInitialized, setIsToneInitialized] = useRecoilState(isToneInitializedAtom);
  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const [playState, setPlayState] = useRecoilState(playStateAtom);

  const setIsPlayheadInvisible = useSetRecoilState(isPlayheadInvisibleAtom);
  const isScrolling = useRecoilValue(isScrollingAtom);
  const setTime = useSetRecoilState(timeAtom);

  const beatRulerRef = React.useRef<HTMLDivElement>(null);
  const playheadRef = React.useRef<HTMLDivElement>(null);

  const jumpToTime = React.useCallback(
    (clickedPosition: number) => {
      const snapClickedPosition = Math.floor(clickedPosition / STEP_WIDTH) * STEP_WIDTH;
      playheadRef.current!.style.display = 'block';
      playheadRef.current!.style.transform = `translateX(${snapClickedPosition}px)`;

      const absolutePosition = snapClickedPosition + scrollLeft;
      const timelinePosition = absolutePosition / STEP_WIDTH;

      const jumpTime = timelinePosition * Tone.Time('16n').toSeconds();
      Tone.Transport.seconds = jumpTime;

      if (!isToneInitialized) {
        Tone.start();
        setIsToneInitialized(true);
      }
      setPlayState('paused');
      setTime(jumpTime);
    },
    [scrollLeft, setTime]
  );

  // animate playhead when started
  const animateOnMoveRef = React.useRef<number | null>(null);

  const animateOnMove = () => {
    const beatRuler = beatRulerRef.current;
    const playhead = playheadRef.current;
    if (!beatRuler || !playhead) return;

    const playheadVelocity = STEP_WIDTH / Tone.Time('16n').toSeconds();
    const absoluteScrollLeftPosition = playheadVelocity * Tone.Transport.seconds;

    const relativeScrollLeft = absoluteScrollLeftPosition - scrollLeft;
    const isPlayheadOutside = relativeScrollLeft < 0 || relativeScrollLeft > beatRuler.clientWidth;

    if (isPlayheadOutside) {
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

    animateOnMoveRef.current = requestAnimationFrame(animateOnMove);
  };

  React.useEffect(() => {
    if (playState === 'started') {
      animateOnMoveRef.current = requestAnimationFrame(animateOnMove);
    } else {
      cancelAnimationFrame(animateOnMoveRef.current!);
      if (playState === 'stopped') {
        playheadRef.current!.style.transform = 'translateX(0)';
      }
    }

    return () => {
      cancelAnimationFrame(animateOnMoveRef.current!);
    };
  }, [animateOnMove, playState]);

  // animate playhead when not started
  const animateOnStaticRef = React.useRef<number | null>(null);

  const animateOnStatic = () => {
    const beatRuler = beatRulerRef.current;
    const playhead = playheadRef.current;
    if (!beatRuler || !playhead) return;

    const playheadVelocity = STEP_WIDTH / Tone.Time('16n').toSeconds();
    const absoluteScrollLeftPosition = playheadVelocity * Tone.Transport.seconds;

    const relativeScrollLeft = absoluteScrollLeftPosition - scrollLeft;
    const isPlayheadOutside = relativeScrollLeft < 0 || relativeScrollLeft > beatRuler.clientWidth;

    if (isPlayheadOutside) {
      setIsPlayheadInvisible(true);
      playhead.style.display = 'none';
    } else {
      setIsPlayheadInvisible(false);
      playhead.style.display = 'block';
    }

    playhead.style.transform = `translateX(${relativeScrollLeft}px)`;

    animateOnStaticRef.current = requestAnimationFrame(animateOnStatic);
  };

  React.useEffect(() => {
    if (playState !== 'started' && isScrolling) {
      animateOnStaticRef.current = requestAnimationFrame(animateOnStatic);
    } else if (playState !== 'started' && !isScrolling) {
      cancelAnimationFrame(animateOnStaticRef.current!);
    }

    return () => {
      cancelAnimationFrame(animateOnStaticRef.current!);
    };
  }, [animateOnStatic, playState]);

  return {
    beatRulerRef,
    playheadRef,
    jumpToTime,
  };
}
