import { Text, Grid, Slider } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { bpmAtom } from '@/atoms/studio';

export default function BpmControl() {
  const [bpm, setBpm] = useRecoilState(bpmAtom);

  const handleChangeBpm = (value: string | number) => {
    setBpm(Number(value));
  };

  return (
    <Grid align="center">
      <Grid.Col span={2}>
        <Text size="xs" c="gray.7">
          빠르기
        </Text>
      </Grid.Col>
      <Grid.Col span={10}>
        <Slider
          color="teal.8"
          defaultValue={bpm}
          min={60}
          max={180}
          step={1}
          onChange={handleChangeBpm}
          labelAlwaysOn
        />
      </Grid.Col>
    </Grid>
  );
}
