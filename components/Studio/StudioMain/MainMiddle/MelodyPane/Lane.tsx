import { useRecoilValue } from 'recoil';
import { LoadingOverlay, UnstyledButton, useMantineTheme } from '@mantine/core';
import { melodyKeysAtom, scrollLeftAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { MELODY_UNIT_HEIGHT, MELODY_UNIT_NUM } from '@/constants/studio';
import RollNote from '../RollNote';
import useMelodyRollNotes from '@/hooks/studio/useMelodyRollNotes';
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

  const { melodyAudioMap, selectedMelodyAudioName } = useMutreeAudioContext();

  const {
    regionRef,
    rollNotes,
    isRegionLoading,
    selectedNoteIds,
    handleDeleteNote,
    handleDragNote,
    handleMouseDownRegion,
    handleResizeNote,
    handleSetIsDragging,
    handleSetIsResizing,
  } = useMelodyRollNotes({
    idPrefix: 'melody',
    unitHeight: MELODY_UNIT_HEIGHT,
    audio: melodyAudioMap[selectedMelodyAudioName.value],
    keys: melodyKeys,
  });

  const handlePlay = (pitch: number) => {
    melodyAudioMap[selectedMelodyAudioName.value][pitch]?.playOnce();
  };

  return (
    <div className={classes.scrollable}>
      <div className={classes.keysAndGridWrapper}>
        <div className={classes.keysAndGrid}>
          <div className={classes.keys}>
            {melodyKeys.map((v) => (
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
              role="none"
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
                  color={v.isAI ? theme.colors.orange[3] : theme.colors.teal[5]}
                  isSelected={selectedNoteIds.includes(v.id)}
                  isAi={v.isAI}
                  onSetIsResizing={handleSetIsResizing}
                  onSetIsDragging={handleSetIsDragging}
                  onResizeNote={handleResizeNote}
                  onDragNote={handleDragNote}
                  onDeleteNote={handleDeleteNote}
                />
              ))}
            </div>
            <LoadingOverlay
              visible={isRegionLoading}
              zIndex={1000}
              loaderProps={{ color: 'teal', type: 'bars' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
