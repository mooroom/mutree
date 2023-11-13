import React from 'react';
import classes from './MainMiddle.module.css';
import useScrollLeftBarRef from '@/hooks/studio/refs/useScrollLeftBarRef';

export default function MainMiddle() {
  const scrollLeftBarRef = useScrollLeftBarRef();

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
