import { Divider } from '@mantine/core';
import MouseControls from './MouseControls';
import InstControls from './InstControls';

export default function Controls() {
  return (
    <>
      <InstControls />
      <Divider my="sm" opacity={0} />
      <MouseControls />
      <Divider my="sm" opacity={0} />
    </>
  );
}
