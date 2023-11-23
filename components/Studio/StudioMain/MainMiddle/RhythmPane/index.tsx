import { ThemeIcon, Select, Slider } from '@mantine/core';
import { IconHeartbeat } from '@tabler/icons-react';
import classes from './index.module.css';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';
import Lane from './Lane';

export default function RhythmPane() {
  const { rhythmAudioNameList, selectedRhythmAudioName, handleRhythmAudioNameChange } =
    useMutreeAudioContext();

  const handleChange = (value: string | null) => {
    const audioName = rhythmAudioNameList.find((v) => v.value === value);
    if (audioName) handleRhythmAudioNameChange(audioName);
  };

  return (
    <div className={classes.rhythmPane}>
      <div className={classes.paneLeft}>
        <div className={classes.instControls}>
          <ThemeIcon variant="light" radius="xl" size={50} color="cyan">
            <IconHeartbeat size={30} />
          </ThemeIcon>
          <div className={classes.instControlRight}>
            <Select
              placeholder="악기 선택"
              size="xs"
              color="teal"
              data={rhythmAudioNameList}
              value={selectedRhythmAudioName.value}
              onChange={handleChange}
            />
            <Slider size="xs" color="cyan" />
          </div>
        </div>
      </div>
      <div className={classes.paneRight}>
        <Lane />
      </div>
    </div>
  );
}
