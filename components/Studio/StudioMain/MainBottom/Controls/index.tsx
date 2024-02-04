import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Divider, Modal, Space } from '@mantine/core';
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

      <Modal opened={open} onClose={close} radius="medium" centered title="음악설정">
        <Space h="lg" />
        <ResolutionControl />
        <Divider my="xl" />
        <DenomNumerControl />
        <Divider my="xl" />
        <BpmControl />
        <Space h="lg" />
      </Modal>
    </>
  );
}
