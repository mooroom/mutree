import { Select, Slider, ThemeIcon } from '@mantine/core';
import classes from './Controls.module.css';
import { IconPiano } from '@tabler/icons-react';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';

export default function InstControls() {
  const { melodyAudioNameList, selectedMelodyAudioName, handleMelodyAudioNameChange } =
    useMutreeAudioContext();

  const handleChange = (value: string | null) => {
    const audioName = melodyAudioNameList.find((v) => v.value === value);
    if (audioName) handleMelodyAudioNameChange(audioName);
  };

  return (
    <div className={classes.instControls}>
      <ThemeIcon variant="light" radius="xl" size={50} color="teal">
        <IconPiano size={30} />
      </ThemeIcon>
      <div className={classes.instControlRight}>
        <Select
          placeholder="악기 선택"
          size="xs"
          color="teal"
          data={melodyAudioNameList}
          value={selectedMelodyAudioName.value}
          onChange={handleChange}
        />
        <Slider size="xs" color="teal" />
      </div>
    </div>
  );
}
