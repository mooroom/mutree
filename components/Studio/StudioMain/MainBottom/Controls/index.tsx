import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Dialog, Divider, Text } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import DenomNumerControl from './DenomNumerControl';
import BpmControl from './BpmControl';
import ResolutionControl from './ResolutionControl';

export default function Controls() {
  const [open, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon variant="outline" radius="xl" color="gray.6" size="xl" onClick={toggle}>
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
