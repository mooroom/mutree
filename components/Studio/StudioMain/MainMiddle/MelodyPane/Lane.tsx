import { melodyKeysAtom, scrollLeftAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import { useRecoilValue } from 'recoil';
import { UnstyledButton, useMantineTheme } from '@mantine/core';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { MELODY_UNIT_HEIGHT, MELODY_UNIT_NUM } from '@/constants/studio';
import RollNote from '../RollNote';
import useRollNotes from '@/hooks/studio/useRollNotes';
import MutreeInstrument from '@/classes/MutreeInstrument';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';

export default function Lane() {
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const melodyKeys = useRecoilValue(melodyKeysAtom);
  const theme = useMantineTheme();

  const gridLinesRef = useGridLinesRef({
    numUnits: MELODY_UNIT_NUM,
    unitHeight: MELODY_UNIT_HEIGHT,
    highlightColor: theme.colors.teal[3],
  });

  const { melodyAudioMap } = useMutreeAudioContext();

  const {
    regionRef,
    rollNotes,
    handleDeleteNote,
    handleDragNoteLeft,
    handleDragNoteTop,
    handleMouseDownRegion,
    handleResizeNote,
    handleSetIsDragging,
    handleSetIsResizing,
  } = useRollNotes({
    idPrefix: 'melody',
    unitHeight: MELODY_UNIT_HEIGHT,
    audio: melodyAudioMap['piano'],
    keys: melodyKeys,
  });

  return (
    <div className={classes.scrollable}>
      <div className={classes.keysAndGridWrapper}>
        <div className={classes.keysAndGrid}>
          <div className={classes.keys}>
            {melodyKeys.map((v) => (
              <UnstyledButton className={classes.key} key={v.pitch}>
                {v.noteName.ko}
              </UnstyledButton>
            ))}
          </div>
          <div className={classes.grid}>
            <canvas className={classes.gridLines} ref={gridLinesRef} />
            <div
              className={classes.rollNotesRegion}
              ref={regionRef}
              onMouseDown={handleMouseDownRegion}
            >
              {rollNotes.map((v) => (
                <RollNote
                  key={v.id}
                  id={v.id}
                  left={v.left - scrollLeft}
                  top={v.top}
                  steps={v.steps}
                  unitHeight={MELODY_UNIT_HEIGHT}
                  color="teal"
                  onSetIsResizing={handleSetIsResizing}
                  onSetIsDragging={handleSetIsDragging}
                  onResizeNote={handleResizeNote}
                  onDragNoteLeft={handleDragNoteLeft}
                  onDragNoteTop={handleDragNoteTop}
                  onDeleteNote={handleDeleteNote}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
