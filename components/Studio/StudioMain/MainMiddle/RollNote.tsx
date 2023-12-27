import { MantineColor, darken } from '@mantine/core';
import React from 'react';
import { STEP_WIDTH } from '@/constants/studio';
import classes from './RollNote.module.css';

interface Props {
  id: string;
  left: number;
  top: number;
  steps: number;
  unitHeight: number;
  color: MantineColor;
  onSetIsResizing: (resizing: boolean) => void;
  onSetIsDragging: (dragging: boolean) => void;
  onResizeNote: (id: string, nextSteps: number) => void;
  onDragNote: (id: string, nextLeft: number, nextTop: number) => void;
  onDeleteNote: (id: string) => void;
}

export default function RollNote({
  id,
  left,
  top,
  steps,
  color,
  unitHeight,
  onResizeNote,
  onSetIsDragging,
  onSetIsResizing,
  onDragNote,
  onDeleteNote,
}: Props) {
  const colorStyles: React.CSSProperties = {
    backgroundColor: color,
    borderColor: darken(color, 0.3),
  };

  const [active, setActive] = React.useState(false);

  const handleMouseDownHead = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onSetIsResizing(true);
      setActive(true);

      const startX = e.clientX;

      const handleMouseMove = (event: MouseEvent) => {
        const dx = event.clientX - startX;
        const nextSteps = Math.floor(dx / STEP_WIDTH) + steps;
        if (nextSteps < 1) return;
        onResizeNote(id, nextSteps);
      };

      const handleMouseUp = () => {
        onSetIsResizing(false);
        setActive(false);
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
      onSetIsDragging(true);
      setActive(true);

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
        setActive(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onDragNote, id, left, top, unitHeight, onSetIsDragging]
  );

  const handleDoubleClick = React.useCallback(() => {
    onDeleteNote(id);
  }, [onDeleteNote, id]);

  return (
    <div
      role="button"
      className={classes.container}
      style={{
        left,
        top,
        width: steps * STEP_WIDTH,
        height: unitHeight,
        ...colorStyles,
      }}
      onMouseDown={handleMouseDownContainer}
      onDoubleClick={handleDoubleClick}
      data-active={active}
      tabIndex={0} // Add tabIndex attribute to make the element focusable
    >
      <div className={classes.head} role="none" onMouseDown={handleMouseDownHead} />
    </div>
  );
}
