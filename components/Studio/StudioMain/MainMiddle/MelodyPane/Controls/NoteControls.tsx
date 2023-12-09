import React from 'react';
import { ROOT_NOTES, SCALE_NAMES } from '@/constants/studio';
import { useRecoilState } from 'recoil';
import { melodyRootNoteAtom, melodyScaleNameAtom } from '@/atoms/studio';
import classes from './Controls.module.css';
import { ScaleName } from '@/types/studio';
import { Grid, Text, Select } from '@mantine/core';
import { getSelectOptionsRootNote, getSelectOptionsScaleName } from '@/utils/studio';

export default function NoteControls() {
  const [rootNote, setRootNote] = useRecoilState(melodyRootNoteAtom);
  const [scaleName, setScaleName] = useRecoilState(melodyScaleNameAtom);

  const scaleOptions = getSelectOptionsScaleName();
  const rootOptions = React.useMemo(() => getSelectOptionsRootNote(scaleName), [scaleName]);

  const handleSelectRoot = (value: string | null) => {
    if (value) setRootNote(Number(value));
  };

  const handleSelectScale = (value: string | null) => {
    if (value) setScaleName(value as ScaleName);
  };

  return (
    <div className={classes.noteControls}>
      <Grid align="center" justify="space-between">
        <Grid.Col span={3}>
          <Text size="xs">으뜸음</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Select
            placeholder="으뜸음 선택"
            data={rootOptions}
            size="xs"
            value={rootNote.toString()}
            onChange={handleSelectRoot}
          />
        </Grid.Col>
      </Grid>
      <Grid align="center" justify="space-between">
        <Grid.Col span={3}>
          <Text size="xs">음계</Text>
        </Grid.Col>
        <Grid.Col span={8}>
          <Select
            placeholder="음계 선택"
            data={scaleOptions}
            size="xs"
            value={scaleName}
            onChange={handleSelectScale}
          />
        </Grid.Col>
      </Grid>
    </div>
  );
}
