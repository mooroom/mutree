import { ThemeIcon, Select, Slider } from '@mantine/core';
import { IconHeartbeat } from '@tabler/icons-react';
import classes from './RhythmPane.module.css';

export default function RhythmPane() {
  return (
    <div className={classes.rhythmPane}>
      <div className={classes.paneLeft}>
        <div className={classes.instControls}>
          <ThemeIcon variant="light" radius="xl" size={50} color="cyan">
            <IconHeartbeat size={30} />
          </ThemeIcon>
          <div className={classes.instControlRight}>
            <Select placeholder="악기 선택" size="xs" />
            <Slider size="xs" color="cyan" />
          </div>
        </div>
      </div>
    </div>
  );
}
