import { useRecoilValue } from 'recoil';
import { Tooltip, UnstyledButton, useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import { rhythmKeysAtom, scrollLeftAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { RHYTHM_UNIT_HEIGHT, RHYTHM_UNIT_NUM, STEP_WIDTH } from '@/constants/studio';
import RollNote from '../RollNote';
import useMutreeNotes from '@/hooks/studio/useMutreeNotes';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';
import RollNoteGhost from '../RollNoteGhost';

export default function Lane() {
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const rhythmKeys = useRecoilValue(rhythmKeysAtom);
  const theme = useMantineTheme();

  const gridLinesRef = useGridLinesRef({
    numUnits: RHYTHM_UNIT_NUM,
    unitHeight: RHYTHM_UNIT_HEIGHT,
  });

  const { rhythmAudioMap, selectedRhythmAudioName } = useMutreeAudioContext();

  const {
    regionRef,
    mutreeNotes,
    clipboardNotes,
    handleDragNote,
    handleMouseDownRegion,
    handleMouseDownNote,
    handleResizeNote,
    handleDeleteSelectedNotes,
    handleSetIsDragging,
  } = useMutreeNotes({
    layer: 'rhythm',
    unitHeight: RHYTHM_UNIT_HEIGHT,
    audio: rhythmAudioMap[selectedRhythmAudioName.value],
    keys: rhythmKeys,
  });

  const handlePlay = (pitch: number) => {
    rhythmAudioMap[selectedRhythmAudioName.value][pitch]?.playOnce();
  };

  const calcRollNote = (x: number, y: number, length: number) => ({
    left: x * STEP_WIDTH - scrollLeft,
    top: y * RHYTHM_UNIT_HEIGHT,
    width: length * STEP_WIDTH,
    height: RHYTHM_UNIT_HEIGHT,
  });

  return (
    <div className={classes.scrollable}>
      <div className={classes.keysAndGridWrapper}>
        <div className={classes.keysAndGrid}>
          <div className={classes.keys}>
            {rhythmKeys.map((v) => (
              <Tooltip label={v.noteName.ko} key={v.pitch} position="right" withArrow>
                <UnstyledButton className={classes.key} onClick={() => handlePlay(v.pitch)}>
                  {v.iconUrl && (
                    <Image src={v.iconUrl} alt={v.noteName.ko} width={30} height={30} />
                  )}
                </UnstyledButton>
              </Tooltip>
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
                  color={theme.colors.cyan[5]}
                  isSelected={v.isSelected}
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
                  color={theme.colors.cyan[5]}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
