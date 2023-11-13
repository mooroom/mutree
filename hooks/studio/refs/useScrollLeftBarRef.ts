import {
  bpmAtom,
  isPlayheadInvisibleAtom,
  isScrollingAtom,
  playStateAtom,
  scrollLeftAtom,
} from '@/atoms/studio';
import { getAbsoluteScrollLeftPosition } from '@/utils/studio';
import React from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';

export default function useScrollLeftBar() {
  const [scrolLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const setIsScrolling = useSetRecoilState(isScrollingAtom);
  const playState = useRecoilValue(playStateAtom);
  const bpmState = useRecoilValue(bpmAtom);
  const isPlayheadInvisible = useRecoilValue(isPlayheadInvisibleAtom);

  const scrollLeftBarRef = React.useRef<HTMLDivElement>(null);

  // set scrollLeft on scroll
  React.useEffect(() => {
    const scrollLeftBar = scrollLeftBarRef.current;
    if (!scrollLeftBar) return;

    const handleScroll = () => {
      setScrollLeft(scrollLeftBar.scrollLeft);
    };

    scrollLeftBar.addEventListener('scroll', handleScroll);
    return () => {
      scrollLeftBar.removeEventListener('scroll', handleScroll);
    };
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

      scrollLeftBar.scrollLeft = getAbsoluteScrollLeftPosition(bpmState);
      setIsScrolling(false);
    };

    scrollLeftBar.addEventListener('mousedown', handleMouseDown);
    scrollLeftBar.addEventListener('mouseup', handleMouseUp);

    return () => {
      scrollLeftBar.removeEventListener('mousedown', handleMouseDown);
      scrollLeftBar.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setIsScrolling, playState, bpmState, isPlayheadInvisible]);

  // observe scrollLeft
  React.useEffect(() => {
    const scrollLeftBar = scrollLeftBarRef.current;
    if (!scrollLeftBar) return;

    scrollLeftBar.scrollLeft = scrolLeft;
  }, [scrolLeft]);

  return scrollLeftBarRef;
}
