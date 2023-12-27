import { Button } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import classes from './index.module.css';
import Lane from './Lane';
import { generateMelodyTriggeredAtom } from '@/atoms/studio';
import Controls from './Controls';

export default function MelodyPane() {
  const [generateMelodyTriggered, setGenerateMelodyTriggered] = useRecoilState(
    generateMelodyTriggeredAtom
  );

  const handleGenerateMelody = () => {
    setGenerateMelodyTriggered(true);
  };

  return (
    <div className={classes.melodyPane}>
      <div className={classes.paneLeft}>
        <div className={classes.paneLeftTop}>
          <Controls />
        </div>
        <div className={classes.paneLeftBottom}>
          <Button
            fullWidth
            rightSection={<IconSparkles size={20} />}
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
