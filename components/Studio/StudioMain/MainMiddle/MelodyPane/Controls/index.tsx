import { Divider } from '@mantine/core';
import InstControls from './InstControls';
import NoteControls from './NoteControls';

export default function Controls() {
  return (
    <>
      <InstControls />
      <Divider my="lg" />
      <NoteControls />
    </>
  );
}
