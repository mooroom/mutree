import { MantineColor, darken, lighten } from '@mantine/core';
import React from 'react';
import { STEP_WIDTH } from '@/constants/studio';
import classes from './RollNote.module.css';

interface Props {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: MantineColor;
  isSelected: boolean;
  isAi?: boolean;
  onMouseDown: (id: string, shiftKeyPressed: boolean) => void;
  onResizeNote: (dLength: number) => void;
  onDragNote: (dx: number, dy: number) => void;
}

export default function RollNote({
  id,
  left,
  top,
  width,
  height,
  color,
  isSelected,
  isAi,
  onMouseDown,
  onResizeNote,
  onDragNote,
}: Props) {
  const colorStyles: React.CSSProperties = {
    backgroundColor: isSelected ? lighten(color, 0.3) : color,
    borderColor: isSelected ? 'white' : darken(color, 0.2),
    opacity: isAi ? 0.7 : 1,
  };

  const handleMouseDownHead = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onMouseDown(id, e.shiftKey);

      const startX = e.clientX;
      let pivotX = 0;

      const handleMouseMove = (event: MouseEvent) => {
        const diffX = event.clientX - startX;
        const dx = Math.floor(diffX / STEP_WIDTH) - pivotX;

        if (dx === 0) return;

        pivotX += dx;
        onResizeNote(dx);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResizeNote, id]
  );

  const handleMouseDownContainer = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onMouseDown(id, e.shiftKey);

      const startX = e.clientX;
      const startY = e.clientY;

      let pivotX = 0;
      let pivotY = 0;

      const handleMouseMove = (event: MouseEvent) => {
        const diffX = event.clientX - startX;
        const diffY = event.clientY - startY;

        const dx = Math.floor(diffX / STEP_WIDTH) - pivotX;
        const dy = Math.floor(diffY / height) - pivotY;

        if (dx === 0 && dy === 0) return;

        pivotX += dx;
        pivotY += dy;
        onDragNote(dx, dy);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onDragNote, id]
  );

  return (
    <div
      role="none"
      className={classes.container}
      style={{
        left,
        top,
        width,
        height,
        ...colorStyles,
      }}
      onMouseDown={handleMouseDownContainer}
    >
      <div className={classes.head} role="none" onMouseDown={handleMouseDownHead} />
    </div>
  );
}
