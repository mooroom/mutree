import { MantineColor, darken } from '@mantine/core';
import React from 'react';
import classes from './RollNote.module.css';

interface Props {
  left: number;
  top: number;
  width: number;
  height: number;
  color: MantineColor;
}

export default function RollNoteGhost({ left, top, width, height, color }: Props) {
  const colorStyles: React.CSSProperties = {
    backgroundColor: color,
    borderColor: darken(color, 0.2),
    opacity: 0.7,
  };

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
    >
      <div className={classes.head} role="none" />
    </div>
  );
}
