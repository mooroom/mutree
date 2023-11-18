import { melodyScaleAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import { useRecoilValue } from 'recoil';
import { UnstyledButton, useMantineTheme } from '@mantine/core';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { MELODY_UNIT_HEIGHT, MELODY_UNIT_NUM } from '@/constants/studio';
import FlexNote from '../FlexNote';

export default function Lane() {
  const melodyScale = useRecoilValue(melodyScaleAtom);
  const theme = useMantineTheme();

  const gridLinesRef = useGridLinesRef({
    numUnits: MELODY_UNIT_NUM,
    unitHeight: MELODY_UNIT_HEIGHT,
    highlightColor: theme.colors.teal[3],
  });

  return (
    <div className={classes.scrollable}>
      <div className={classes.keysAndGridWrapper}>
        <div className={classes.keysAndGrid}>
          <div className={classes.keys}>
            {melodyScale.map((note) => (
              <UnstyledButton className={classes.key} key={note}>
                {note}
              </UnstyledButton>
            ))}
          </div>
          <div className={classes.grid}>
            <canvas className={classes.gridLines} ref={gridLinesRef} />
            <div className={classes.regionNotes}>
              <FlexNote
                id={'1'}
                left={0}
                top={0}
                steps={1}
                unitHeight={MELODY_UNIT_HEIGHT}
                onResizeNote={() => {}}
                onDragNote={() => {}}
                onEditNote={() => {}}
                onDeleteNote={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
