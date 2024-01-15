import { useRecoilValue } from 'recoil';
import { LoadingOverlay, UnstyledButton, useMantineTheme } from '@mantine/core';
import { melodyKeysAtom, scrollLeftAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { MELODY_UNIT_HEIGHT, MELODY_UNIT_NUM, STEP_WIDTH } from '@/constants/studio';
import RollNote from '../RollNote';
import useMutreeNotes from '@/hooks/studio/useMutreeNotes';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';
import RollNoteGhost from '../RollNoteGhost';

export default function Lane() {
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const melodyKeys = useRecoilValue(melodyKeysAtom);
  const theme = useMantineTheme();

  const gridLinesRef = useGridLinesRef({
    numUnits: MELODY_UNIT_NUM,
    unitHeight: MELODY_UNIT_HEIGHT,
    // highlightColor: theme.colors.teal[3],
  });

  const { melodyAudioMap, selectedMelodyAudioName } = useMutreeAudioContext();

  const {
    regionRef,
    mutreeNotes,
    clipboardNotes,
    isRegionLoading,
    handleDragNote,
    handleMouseDownRegion,
    handleMouseDownNote,
    handleResizeNote,
    handleDeleteSelectedNotes,
    handleSetIsDragging,
  } = useMutreeNotes({
    layer: 'melody',
    unitHeight: MELODY_UNIT_HEIGHT,
    audio: melodyAudioMap[selectedMelodyAudioName.value],
    keys: melodyKeys,
  });

  const handlePlay = (pitch: number) => {
    melodyAudioMap[selectedMelodyAudioName.value][pitch]?.playOnce();
  };

  const calcRollNote = (x: number, y: number, length: number) => ({
    left: x * STEP_WIDTH - scrollLeft,
    top: y * MELODY_UNIT_HEIGHT,
    width: length * STEP_WIDTH,
    height: MELODY_UNIT_HEIGHT,
  });

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
              role="tab"
              tabIndex={0}
              className={classes.mutreeNotesRegion}
              ref={regionRef}
              onMouseDown={handleMouseDownRegion}
              onKeyDown={handleDeleteSelectedNotes}
            >
              {mutreeNotes.map((v) => (
                <RollNote
                  key={v.id}
                  id={v.id}
                  {...calcRollNote(v.x, v.y, v.length)}
                  color={v.isAI ? theme.colors.orange[3] : theme.colors.teal[5]}
                  isSelected={v.isSelected}
                  isAi={v.isAI}
                  onMouseDown={handleMouseDownNote}
                  onResizeNote={handleResizeNote}
                  onDragNote={handleDragNote}
                  onSetIsDragging={handleSetIsDragging}
                />
              ))}
              {clipboardNotes.map((v, index) => (
                <RollNoteGhost
                  key={index}
                  {...calcRollNote(v.x, v.y, v.length)}
                  color={theme.colors.teal[5]}
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
