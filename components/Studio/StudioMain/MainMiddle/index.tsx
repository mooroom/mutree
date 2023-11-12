import React from 'react';
import classes from './MainMiddle.module.css';
import useScrollLeftBar from '@/hooks/studio/useScrollLeftBar';

export default function MainMiddle() {
  const { scrollLeftBarRef } = useScrollLeftBar();

  return (
    <div className={classes.container}>
      <div className={classes.splitPane}>
        <div className={classes.pane1} />
        <div className={classes.splitter} />
        <div className={classes.pane2} />
      </div>
      <div className={classes.scrollLeftBarSection}>
        <div className={classes.scrollLeftBar} ref={scrollLeftBarRef}>
          <div />
        </div>
      </div>
    </div>
  );
}
