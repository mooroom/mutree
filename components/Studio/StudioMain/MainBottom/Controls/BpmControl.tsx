import { Text, Grid, Slider, Flex } from '@mantine/core';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { bpmAtom, playStateAtom } from '@/atoms/studio';

export default function BpmControl() {
  const [bpm, setBpm] = useRecoilState(bpmAtom);
  const setPlayState = useSetRecoilState(playStateAtom);

  const handleChangeBpm = (value: string | number) => {
    setPlayState('paused');
    setBpm(Number(value));
  };

  return (
    <Grid align="center">
      <Grid.Col span={3}>
        <Text size="xs" c="gray.7">
          빠르기
        </Text>
      </Grid.Col>
      <Grid.Col span={9}>
        <Flex direction="row" align="center" style={{ width: '100%' }}>
          <Slider
            color="teal.8"
            defaultValue={bpm}
            min={30}
            max={300}
            step={1}
            onChange={handleChangeBpm}
            style={{ flex: 1 }}
          />
          <Text
            size="xs"
            c="teal.8"
            fw={700}
            style={{
              width: 40,
              padding: '0 10px',
            }}
          >
            {bpm}
          </Text>
        </Flex>
      </Grid.Col>
    </Grid>
  );
}
