'use client';

import React from 'react';
import SplitPane, { Pane } from 'split-pane-react';
import classes from './MainMiddle.module.css';

export default function MainMiddle() {
  const [sizes, setSizes] = React.useState<(number | string)[]>(['50%', '50%']);

  return (
    <div className={classes.container}>
      <div className={classes.splitPaneWrapper}>
        <SplitPane
          split="horizontal"
          sizes={sizes}
          sashRender={() => <div className={classes.splitter} />}
          onChange={(s) => setSizes(s)}
        >
          <Pane className={classes.pane} minSize={100} maxSize={1000}>
            <div style={{ height: '100%' }}>dsf</div>
          </Pane>
          <Pane className={classes.pane} minSize={100} maxSize={1000}>
            <div style={{ height: '100%' }}>dsfs</div>
          </Pane>
        </SplitPane>
      </div>
    </div>
  );
}
