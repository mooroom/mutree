import React from 'react';
import { ActionIcon, Button, ButtonGroup } from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { IconEqual } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import classes from './MainTop.module.css';
import useBeatRulerAxisRef from '@/hooks/studio/refs/useBeatRulerAxisRef';
import useTimeLine from '@/hooks/studio/useTimeLine';
import { scrollLeftAtom } from '@/atoms/studio';
import { STEP_WIDTH } from '@/constants/studio';

export default function MainTop() {
  const scrollLeft = useRecoilValue(scrollLeftAtom);

  const [value1, toggle1] = useToggle(['teal.5', 'gray.5']);
  const [value2, toggle2] = useToggle(['cyan.5', 'gray.5']);

  const { beatRulerRef, playheadRef, jumpToTime } = useTimeLine();
  const beatRulerAxisRef = useBeatRulerAxisRef();
  const timelineRef = React.useRef<HTMLDivElement>(null);

  const handleClickTimeline = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const timeline = timelineRef.current;
      if (!timeline) return;

      const offsetX = e.clientX - timeline.getBoundingClientRect().left;
      const absolutePosition = offsetX + scrollLeft;
      const timelinePosition = Math.floor(absolutePosition / STEP_WIDTH);
      jumpToTime(timelinePosition);
    },
    [beatRulerRef, scrollLeft, jumpToTime]
  );

  return (
    <div className={classes.container}>
      <div className={classes.trackListHeader}>
        <ButtonGroup className={classes.trackActivateButtonGroup}>
          <Button
            size="xs"
            className={classes.trackActivateButton}
            color={value1}
            onClick={() => toggle1()}
          >
            가락
          </Button>
          <Button
            size="xs"
            className={classes.trackActivateButton}
            color={value2}
            onClick={() => toggle2()}
          >
            리듬
          </Button>
        </ButtonGroup>
      </div>
      <div className={classes.trackHeightEqualizer}>
        <ActionIcon variant="filled" color="gray" aria-label="trackHeightEqualizer">
          <IconEqual />
        </ActionIcon>
      </div>
      <div className={classes.compositionHeader}>
        <div
          role="presentation"
          className={classes.timelineControls}
          ref={timelineRef}
          onClick={handleClickTimeline}
        >
          <div className={classes.beatRuler} ref={beatRulerRef}>
            <canvas className={classes.axisCanvas} ref={beatRulerAxisRef} />
          </div>
          <div className={classes.cycleMarker} />
          <div className={classes.playhead} ref={playheadRef}>
            <div className={classes.playheadBody} />
            <div className={classes.playheadHead} />
          </div>
        </div>
      </div>
    </div>
  );
}
