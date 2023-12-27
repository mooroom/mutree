import { Divider } from '@mantine/core';
import InstControls from './InstControls';
import NoteControls from './NoteControls';
import MouseControls from './MouseControls';

export default function Controls() {
  return (
    <>
      <InstControls />
      <Divider my="sm" opacity={0} />
      <MouseControls />
      <Divider my="sm" opacity={0} />
      <NoteControls />
    </>
  );
}
