import usePlayControls from '@/hooks/studio/usePlayControls';
import classes from './MainBottom.module.css';
import { ActionIcon, Divider, Group, Menu, Text } from '@mantine/core';
import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconSettings,
} from '@tabler/icons-react';
import { BpmControl, DenomNumerControl, ResolutionControl } from './Controls';
import { useMediaQuery } from '@mantine/hooks';

export default function MainBottom() {
  const { formattedTime, togglePlay, stop, playState } = usePlayControls();
  const matches = useMediaQuery('(min-width: 768px)');

  const togglePlayButtonColor = playState !== 'started' ? 'gray.6' : 'teal.8';
  const togglePlayButtonVariant = playState !== 'started' ? 'outline' : 'filled';
  const playIcon = playState !== 'started' ? <IconPlayerPlayFilled /> : <IconPlayerPauseFilled />;

  return (
    <div className={classes.container}>
      <div className={classes.leftgroup}>
        <div className={classes.playStateControls}>
          <ActionIcon
            onClick={togglePlay}
            variant={togglePlayButtonVariant}
            radius="xl"
            color={togglePlayButtonColor}
            size="xl"
          >
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
      {matches ? (
        <Group className={classes.rightgroup} gap="lg">
          <ResolutionControl />
          <Divider orientation="vertical" />
          <DenomNumerControl />
          <Divider orientation="vertical" />
          <BpmControl />
        </Group>
      ) : (
        <Menu>
          <Menu.Target>
            <ActionIcon variant="outline" radius="xl" color="gray.6" size="xl">
              <IconSettings />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>해상도</Menu.Label>
          </Menu.Dropdown>
        </Menu>
      )}
    </div>
  );
}
