import { Group, Text, Select, Grid } from '@mantine/core';
import type { ComboboxItem } from '@mantine/core';
import { useRecoilState } from 'recoil';
import { NUMERATORS, DENOMINATORS } from '@/constants/studio';
import { denomAtom, numerAtom } from '@/atoms/studio';
import { Denominator, Numerator } from '@/types/studio';

const numerOptions: ComboboxItem[] = NUMERATORS.map((v) => ({
  label: String(v),
  value: String(v),
}));
const denomOptions: ComboboxItem[] = DENOMINATORS.map((v) => ({
  label: String(v),
  value: String(v),
}));

export default function DenomNumerControl() {
  const [numer, setNumer] = useRecoilState(numerAtom);
  const [denom, setDenom] = useRecoilState(denomAtom);

  const numerValue = String(numer);
  const denomValue = String(denom);

  const handleNumerChange = (value: string | null) => {
    if (value) setNumer(Number(value) as Numerator);
  };

  const handleDenomChange = (value: string | null) => {
    if (value) setDenom(Number(value) as Denominator);
  };

  return (
    <Grid>
      <Grid.Col span={2}>
        <Text size="xs" c="gray.7">
          박자
        </Text>
      </Grid.Col>
      <Grid.Col span={10}>
        <Group wrap="nowrap">
          <Select value={numerValue} data={numerOptions} onChange={handleNumerChange} />
          /
          <Select value={denomValue} data={denomOptions} onChange={handleDenomChange} />
        </Group>
      </Grid.Col>
    </Grid>
  );
}
