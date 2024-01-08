import { STEP_WIDTH } from '@/constants/studio';
import { MantineColor, darken, lighten } from '@mantine/core';
import React from 'react';
import classes from './RollNote.module.css';

interface Props {
  id: string;
  left: number;
  top: number;
  steps: number;
  unitHeight: number;
  color: MantineColor;
  isSelected?: boolean;
  isAi?: boolean;
  onMouseDown: (id: string, shiftKeyPressed: boolean) => void;
  onSetIsResizing: (resizing: boolean) => void;
  onSetIsDragging: (dragging: boolean) => void;
  onResizeNote: (id: string, nextSteps: number) => void;
  onDragNote: (id: string, nextLeft: number, nextTop: number) => void;
}

export default function RollNote({
  id,
  left,
  top,
  steps,
  color,
  unitHeight,
  isSelected,
  isAi,
  onMouseDown,
  onResizeNote,
  onSetIsDragging,
  onSetIsResizing,
  onDragNote,
}: Props) {
  // const mouseControlState = useRecoilValue(melodyMouseControlAtom);

  const colorStyles: React.CSSProperties = {
    backgroundColor: isSelected ? lighten(color, 0.3) : color,
    borderColor: isSelected ? 'white' : darken(color, 0.2),
    opacity: isAi ? 0.7 : 1,
  };

  // const [active, setActive] = React.useState(false);

  const handleMouseDownHead = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onMouseDown(id, e.shiftKey);
      onSetIsResizing(true);

      const startX = e.clientX;

      const handleMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - startX;
        const nextSteps = Math.floor(dx / STEP_WIDTH) + steps;
        // fixme: debounce 필요
        if (nextSteps < 1) return;
        onResizeNote(id, nextSteps);
      };

      const handleMouseUp = () => {
        onSetIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResizeNote, id, steps, onSetIsResizing]
  );

  const handleMouseDownContainer = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onMouseDown(id, e.shiftKey);
      onSetIsDragging(true);

      const startX = e.clientX;
      const startY = e.clientY;

      const handleMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const nextLeft = Math.floor(dx / STEP_WIDTH) * STEP_WIDTH + left;
        const nextTop = Math.floor(dy / unitHeight) * unitHeight + top;

        if (nextLeft < 0 || nextTop < 0) return;
        if (nextLeft === left && nextTop === top) return;

        onDragNote(id, nextLeft, nextTop);
      };

      const handleMouseUp = () => {
        onSetIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onDragNote, id, left, top, unitHeight, onSetIsDragging]
  );

  return (
    <div
      role="none"
      className={classes.container}
      style={{
        left,
        top,
        width: steps * STEP_WIDTH,
        height: unitHeight,
        ...colorStyles,
      }}
      onMouseDown={handleMouseDownContainer}
      // 필요하면 추가
      // onDoubleClick={handleDoubleClick}
    >
      <div className={classes.head} role="none" onMouseDown={handleMouseDownHead} />
    </div>
  );
}
