'use client';

import React from 'react';
import classes from './MainMiddle.module.css';

export default function MainMiddle() {
  const [sizes, setSizes] = React.useState<(number | string)[]>(['50%', '50%']);

  return (
    <div className={classes.container}>
      <div className={classes.splitPane}>
        <div className={classes.pane1} />
        <div className={classes.splitter} />
        <div className={classes.pane2} />
      </div>
    </div>
  );
}
