import { useRecoilValue } from 'recoil';
import { Tooltip, UnstyledButton, useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import { rhythmKeysAtom, scrollLeftAtom } from '@/atoms/studio';
import classes from './Lane.module.css';
import useGridLinesRef from '@/hooks/studio/refs/useGridLinesRef';
import { RHYTHM_UNIT_HEIGHT, RHYTHM_UNIT_NUM } from '@/constants/studio';
import RollNote from '../RollNote';
import useRhythmRollNotes from '@/hooks/studio/useRhythmRollNotes';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';

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
    rollNotes,
    handleDeleteNote,
    handleDragNote,
    handleMouseDownRegion,
    handleResizeNote,
    handleSetIsDragging,
    handleSetIsResizing,
  } = useRhythmRollNotes({
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
              className={classes.rollNotesRegion}
              ref={regionRef}
              onMouseDown={handleMouseDownRegion}
              role="presentation"
            >
              {rollNotes.map((v) => (
                <RollNote
                  key={v.id}
                  id={v.id}
                  left={v.left - scrollLeft}
                  top={v.top}
                  steps={v.steps}
                  unitHeight={RHYTHM_UNIT_HEIGHT}
                  color={theme.colors.cyan[5]}
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
