import React from 'react';
import { Group, Combobox, useCombobox, InputBase, Input, Text, Grid } from '@mantine/core';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { resolutionAtom } from '@/atoms/studio';
import { RESOLUTIONS } from '@/constants/studio';
import { Resolution } from '@/types/studio';

export default function ResolutionControl() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [resolution, setResolution] = useRecoilState(resolutionAtom);
  const [value, setValue] = React.useState<string | null>(resolution);

  const options = [
    <Combobox.Option value={RESOLUTIONS[0]} key={RESOLUTIONS[0]}>
      <Group>
        <Image src="/studio/images/4n.svg" width={16} height={16} alt="4n" />
        <span>4분음표</span>
      </Group>
    </Combobox.Option>,
    <Combobox.Option value={RESOLUTIONS[1]} key={RESOLUTIONS[1]}>
      <Group>
        <Image src="/studio/images/8n.svg" width={16} height={16} alt="8n" />
        <span>8분음표</span>
      </Group>
    </Combobox.Option>,
    <Combobox.Option value={RESOLUTIONS[2]} key={RESOLUTIONS[2]}>
      <Group>
        <Image src="/studio/images/16n.svg" width={16} height={16} alt="16n" />
        <span>16분음표</span>
      </Group>
    </Combobox.Option>,
  ];

  const renderValue = (val: string) =>
    val === RESOLUTIONS[0] ? (
      <span>4분음표</span>
    ) : val === RESOLUTIONS[1] ? (
      <span>8분음표</span>
    ) : val === RESOLUTIONS[2] ? (
      <span>16분음표</span>
    ) : null;

  const handleOptionSubmit = (val: string) => {
    setResolution(val as Resolution);
    setValue(val);
    combobox.closeDropdown();
  };

  return (
    <Combobox store={combobox} onOptionSubmit={handleOptionSubmit} position="top">
      <Grid align="center">
        <Grid.Col span={3}>
          <Text size="xs" c="gray.7">
            기준음표
          </Text>
        </Grid.Col>
        <Grid.Col span={9}>
          <Combobox.Target>
            <InputBase
              component="button"
              pointer
              rightSection={<Combobox.Chevron />}
              onClick={() => combobox.toggleDropdown()}
              w="100%"
            >
              {value ? renderValue(value) : <Input.Placeholder>기준음표 선택</Input.Placeholder>}
            </InputBase>
          </Combobox.Target>
        </Grid.Col>
      </Grid>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
