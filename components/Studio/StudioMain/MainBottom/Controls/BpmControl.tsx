import { bpmAtom } from '@/atoms/studio';
import { Group, Text, NumberInput } from '@mantine/core';
import { useRecoilState } from 'recoil';

export default function BpmControl() {
  const [bpm, setBpm] = useRecoilState(bpmAtom);

  const handleChangeBpm = (value: string | number) => {
    setBpm(Number(value));
  };

  return (
    <Group>
      <Text>BPM:</Text>
      <NumberInput placeholder="bpm" onChange={handleChangeBpm} value={bpm} />
    </Group>
  );
}
