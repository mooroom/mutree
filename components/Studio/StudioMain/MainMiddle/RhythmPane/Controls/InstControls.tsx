import { ThemeIcon, Select, Slider } from '@mantine/core';
import { IconHeartbeat } from '@tabler/icons-react';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';
import classes from './Controls.module.css';

export default function RhythmInstControls() {
  const {
    rhythmVolumeMap,
    rhythmAudioNameList,
    selectedRhythmAudioName,
    handleRhythmAudioNameChange,
  } = useMutreeAudioContext();

  const handleChange = (value: string | null) => {
    const audioName = rhythmAudioNameList.find((v) => v.value === value);
    if (audioName) handleRhythmAudioNameChange(audioName);
  };

  const handleVolumeChange = (value: number) => {
    const vNode = rhythmVolumeMap[selectedRhythmAudioName.value];
    // value: 0 ~ 10, volume: -20 ~ 0
    vNode.volume.value = value === 0 ? -Infinity : (value - 10) * 2;
  };

  return (
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
        <Slider
          size="xs"
          color="cyan"
          defaultValue={5}
          min={0}
          max={10}
          step={1}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
