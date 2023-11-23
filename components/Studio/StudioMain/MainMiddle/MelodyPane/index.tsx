import { Button, Divider, Overlay, Select, Slider, ThemeIcon } from '@mantine/core';
import classes from './index.module.css';
import { IconPiano, IconRobot } from '@tabler/icons-react';
import Lane from './Lane';
import { useMutreeAudioContext } from '@/components/Studio/MutreeAudioProvider';
import { generateMelodyTriggeredAtom } from '@/atoms/studio';
import { useRecoilState } from 'recoil';

export default function MelodyPane() {
  const { melodyAudioNameList, selectedMelodyAudioName, handleMelodyAudioNameChange } =
    useMutreeAudioContext();
  const [generateMelodyTriggered, setGenerateMelodyTriggered] = useRecoilState(
    generateMelodyTriggeredAtom
  );

  const handleChange = (value: string | null) => {
    const audioName = melodyAudioNameList.find((v) => v.value === value);
    if (audioName) handleMelodyAudioNameChange(audioName);
  };

  const handleGenerateMelody = () => {
    setGenerateMelodyTriggered(true);
  };

  return (
    <div className={classes.melodyPane}>
      <div className={classes.paneLeft}>
        <div className={classes.paneLeftTop}>
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
        <div className={classes.paneLeftBottom}>
          <Button
            fullWidth
            rightSection={<IconRobot size={20} />}
            variant="gradient"
            gradient={{ from: 'teal.5', to: 'orange.3', deg: 100 }}
            onClick={handleGenerateMelody}
            loading={generateMelodyTriggered}
          >
            AI 멜로디 생성
          </Button>
        </div>
      </div>
      <div className={classes.paneRight}>
        <Lane />
      </div>
    </div>
  );
}
