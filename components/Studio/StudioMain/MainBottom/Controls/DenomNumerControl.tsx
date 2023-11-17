import { Group, Text, Select } from '@mantine/core';
import { NUMERATORS, DENOMINATORS } from '@/constants/studio';
import type { ComboboxItem } from '@mantine/core';
import { useRecoilState } from 'recoil';
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
    <Group>
      <Text>박자:</Text>
      <Select w={70} value={numerValue} data={numerOptions} onChange={handleNumerChange} />
      /
      <Select w={70} value={denomValue} data={denomOptions} onChange={handleDenomChange} />
    </Group>
  );
}
