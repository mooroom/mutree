import { Divider, Select, Slider, ThemeIcon } from '@mantine/core';
import classes from './MelodyPane.module.css';
import { IconPiano } from '@tabler/icons-react';
import Lane from './Lane';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';

export default function MelodyPane() {
  const { melodyAudioNameList, selectedMelodyAudioName, handleMelodyAudioNameChange } =
    useMutreeAudioContext();

  const handleChange = (value: string | null) => {
    const audioName = melodyAudioNameList.find((v) => v.value === value);
    if (audioName) handleMelodyAudioNameChange(audioName);
  };

  return (
    <div className={classes.melodyPane}>
      <div className={classes.paneLeft}>
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
        <Divider />
      </div>
      <div className={classes.paneRight}>
        <Lane />
      </div>
    </div>
  );
}
