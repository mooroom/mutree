import { Divider, Select, Slider, ThemeIcon } from '@mantine/core';
import classes from './MelodyPane.module.css';
import { IconPiano } from '@tabler/icons-react';
import Lane from './Lane';

export default function MelodyPane() {
  return (
    <div className={classes.melodyPane}>
      <div className={classes.paneLeft}>
        <div className={classes.instControls}>
          <ThemeIcon variant="light" radius="xl" size={50} color="teal">
            <IconPiano size={30} />
          </ThemeIcon>
          <div className={classes.instControlRight}>
            <Select placeholder="악기 선택" size="xs" />
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
