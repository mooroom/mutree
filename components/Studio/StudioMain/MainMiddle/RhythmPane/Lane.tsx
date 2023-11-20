import { rhythmKeysAtom, scrollLeftAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import { useRecoilValue } from 'recoil';
import { UnstyledButton, useMantineTheme } from '@mantine/core';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { RHYTHM_UNIT_HEIGHT, RHYTHM_UNIT_NUM } from '@/constants/studio';
import RollNote from '../RollNote';
import useRollNotes from '@/hooks/studio/useRollNotes';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';

export default function Lane() {
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const rhythmKeys = useRecoilValue(rhythmKeysAtom);

  const gridLinesRef = useGridLinesRef({
    numUnits: RHYTHM_UNIT_NUM,
    unitHeight: RHYTHM_UNIT_HEIGHT,
  });

  const { rhythmAudioMap, selectedRhythmAudioName } = useMutreeAudioContext();

  const {
    regionRef,
    rollNotes,
    handleDeleteNote,
    handleDragNote,
    handleMouseDownRegion,
    handleResizeNote,
    handleSetIsDragging,
    handleSetIsResizing,
  } = useRollNotes({
    idPrefix: 'rhythm',
    unitHeight: RHYTHM_UNIT_HEIGHT,
    audio: rhythmAudioMap[selectedRhythmAudioName.value],
    keys: rhythmKeys,
  });

  const handlePlay = (pitch: number) => {
    rhythmAudioMap[selectedRhythmAudioName.value][pitch]?.playOnce();
  };

  return (
    <div className={classes.scrollable}>
      <div className={classes.keysAndGridWrapper}>
        <div className={classes.keysAndGrid}>
          <div className={classes.keys}>
            {rhythmKeys.map((v) => (
              <UnstyledButton
                className={classes.key}
                key={v.pitch}
                onClick={() => handlePlay(v.pitch)}
              >
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
                  unitHeight={RHYTHM_UNIT_HEIGHT}
                  color="cyan"
                  onSetIsResizing={handleSetIsResizing}
                  onSetIsDragging={handleSetIsDragging}
                  onResizeNote={handleResizeNote}
                  onDragNote={handleDragNote}
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
