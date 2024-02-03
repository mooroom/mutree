import React from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import * as Tone from 'tone';
import {
  isPlayheadInvisibleAtom,
  isScrollingAtom,
  playStateAtom,
  scrollLeftAtom,
} from '@/atoms/studio';
import { STEP_WIDTH } from '@/constants/studio';

export default function useScrollLeftBar() {
  const [scrolLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const setIsScrolling = useSetRecoilState(isScrollingAtom);
  const playState = useRecoilValue(playStateAtom);
  const isPlayheadInvisible = useRecoilValue(isPlayheadInvisibleAtom);

  const scrollLeftBarRef = React.useRef<HTMLDivElement>(null);

  // set scrollLeft on scroll
  React.useEffect(() => {
    const scrollLeftBar = scrollLeftBarRef.current;
    if (!scrollLeftBar) return;

    const handleScroll = () => {
      console.log('scrollLeftBar.scrollLeft', scrollLeftBar.scrollLeft);
      setScrollLeft(scrollLeftBar.scrollLeft);
    };

    scrollLeftBar.addEventListener('scroll', handleScroll);
    // eslint-disable-next-line consistent-return
    return () => scrollLeftBar.removeEventListener('scroll', handleScroll);
  }, [setScrollLeft]);

  // set isScrolling on mouse down/up
  React.useEffect(() => {
    const scrollLeftBar = scrollLeftBarRef.current;
    if (!scrollLeftBar) return;

    const handleMouseDown = () => {
      setIsScrolling(true);
    };
    const handleMouseUp = () => {
      if (playState !== 'started' || !isPlayheadInvisible) return;

      scrollLeftBar.scrollLeft =
        (STEP_WIDTH / Tone.Time('16n').toSeconds()) * Tone.Transport.seconds;
      setIsScrolling(false);
    };

    scrollLeftBar.addEventListener('mousedown', handleMouseDown);
    scrollLeftBar.addEventListener('mouseup', handleMouseUp);

    // eslint-disable-next-line consistent-return
    return () => {
      scrollLeftBar.removeEventListener('mousedown', handleMouseDown);
      scrollLeftBar.removeEventListener('mouseup', handleMouseUp);
    };
  }, [playState, isPlayheadInvisible, setIsScrolling]);

  // observe scrollLeft
  React.useEffect(() => {
    const scrollLeftBar = scrollLeftBarRef.current;
    if (!scrollLeftBar) return;

    scrollLeftBar.scrollLeft = scrolLeft;
  }, [scrolLeft]);

  return scrollLeftBarRef;
}
