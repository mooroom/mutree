import usePlayControls from '@/hooks/studio/usePlayControls';
import classes from './MainBottom.module.css';
import { ActionIcon, Text } from '@mantine/core';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
} from '@tabler/icons-react';

export default function MainBottom() {
  const { formattedTime, togglePlay, stop, playState } = usePlayControls();

  const togglePlayButtonColor = playState !== 'started' ? 'gray.6' : 'teal.8';
  const playIcon = playState !== 'started' ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />;

  return (
    <div className={classes.container}>
      <div className={classes.leftgroup}>
        <div className={classes.playStateControls}>
          <ActionIcon onClick={togglePlay} radius="xl" color={togglePlayButtonColor} size="xl">
            {playIcon}
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
