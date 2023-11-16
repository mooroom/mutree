import React from 'react';
import classes from './MainMiddle.module.css';
import useScrollLeftBarRef from '@/hooks/studio/refs/useScrollLeftBarRef';
import MelodyPane from './MelodyPane';
import RhythmPane from './RhythmPane';

export default function MainMiddle() {
  const scrollLeftBarRef = useScrollLeftBarRef();

  return (
    <div className={classes.container}>
      <div className={classes.splitPane}>
        <MelodyPane />
        <div className={classes.splitter} />
        <RhythmPane />
      </div>
      <div className={classes.scrollLeftBarSection}>
        <div className={classes.scrollLeftBar} ref={scrollLeftBarRef}>
          <div />
        </div>
      </div>
    </div>
  );
}
