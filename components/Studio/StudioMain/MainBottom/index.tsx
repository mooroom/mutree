import useTimer from '@/hooks/studio/useTimer';
import classes from './MainBottom.module.css';
import { ActionIcon, Text } from '@mantine/core';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from '@tabler/icons-react';

export default function MainBottom() {
  const { formattedTime, togglePlay, stop, playState } = useTimer();

  return (
    <div className={classes.container}>
      <div className={classes.leftgroup}>
        <div className={classes.playStateControls}>
          <ActionIcon onClick={togglePlay} radius="xl" color="teal.8" size="xl">
            {playState !== 'started' ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />}
          </ActionIcon>
          <ActionIcon onClick={stop} variant="outline" radius="xl" color="gray.6" size="xl">
            <IconPlayerStopFilled />
          </ActionIcon>
        </div>
        <div className={classes.timer}>
          <Text size="xl">{formattedTime}</Text>
        </div>
      </div>
    </div>
  );
}
