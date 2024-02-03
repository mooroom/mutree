import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Dialog, Divider, Text } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useRecoilState } from 'recoil';
import DenomNumerControl from './DenomNumerControl';
import BpmControl from './BpmControl';
import ResolutionControl from './ResolutionControl';
import { playStateAtom } from '@/atoms/studio';

export default function Controls() {
  const [playState, setPlayState] = useRecoilState(playStateAtom);
  const [open, { toggle, close }] = useDisclosure(false);

  const handleOpen = () => {
    if (playState !== 'stopped') setPlayState('stopped');
    toggle();
  };

  return (
    <>
      <ActionIcon variant="outline" radius="xl" color="gray.6" size="xl" onClick={handleOpen}>
        <IconSettings />
      </ActionIcon>

      <Dialog opened={open} withCloseButton onClose={close} radius="mediun">
        <Text size="sm" mb="lg" fw={500}>
          음악 설정
        </Text>

        <ResolutionControl />
        <Divider my="lg" />
        <DenomNumerControl />
        <Divider my="lg" />
        <BpmControl />
      </Dialog>
    </>
  );
}
