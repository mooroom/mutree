'use client';

import { Title, Text, Stack, Card, Group, Mark, Button, Anchor, Code, Badge } from '@mantine/core';
import Image from 'next/image';
import classes from './Welcome.module.css';

interface TutorialCardProps {
  number: number;
  title: React.ReactNode;
  isBeta?: boolean;
  image: string;
  description: React.ReactNode;
}

const TutorialCard = ({ number, title, isBeta, image, description }: TutorialCardProps) => (
  <Card shadow="sm" padding="xl">
    <Card.Section>
      <Image src={image} alt={`tutorial${number}`} width={700} height={350} />
    </Card.Section>
    <Group justify="space-between" align="center" mt="md" mb="sm">
      <Group align="center" gap="xs">
        <Badge color="teal" variant="filled">
          {number}
        </Badge>
        <Text fw={900} fz="lg">
          {title}
        </Text>
      </Group>

      {isBeta && (
        <Badge color="red" variant="filled">
          Beta
        </Badge>
      )}
    </Group>

    <Text size="md" c="dark">
      {description}
    </Text>
  </Card>
);

const tutorials = [
  {
    number: 1,
    title: '멜로디와 리듬으로 음악 만들기',
    image: '/tutorials/images/num1.png',
    description: (
      <>
        멜로디와 리듬을 조합하여 나만의 음악을 만들어보세요. 마우스 클릭으로 오디오 이벤트를
        추가하고 드래그로 위치와 길이를 조절할 수 있습니다. 어떤 조합이 가장 멋진 음악을 만들까요?
        여러분의 상상력을 발휘해보세요!
      </>
    ),
  },
  {
    number: 2,
    title: (
      <>
        오디오 이벤트 편집하기 <Code>Shift</Code>, <Code>Alt / Option</Code>, <Code>Delete</Code>
      </>
    ),
    image: '/tutorials/images/num2.png',
    description: (
      <>
        추가한 멜로디와 리듬을 들어보고 수정해보세요. <Code>Shift</Code> 키를 누르면 한번에 여러개의
        오디오 이벤트를 선택하고 드래그로 위치와 길이를 조절할 수 있습니다.{' '}
        <Code>Alt / Option</Code> 키를 누른 채로 드래그하면 복사가 가능하고, <Code>Delete</Code>{' '}
        키로 선택한 오디오 이벤트를 삭제할 수 있습니다.
      </>
    ),
  },
  {
    number: 3,
    title: '플레이헤드 이동하기',
    image: '/tutorials/images/num3.png',
    description: (
      <>
        마우스를 클릭하여 플레이헤드를 원하는 위치로 이동시키세요. 플레이헤드를 이동하면 현재
        위치에서 음악이 재생됩니다.
      </>
    ),
  },
  {
    number: 4,
    title: '친구들에게 공유하기',
    image: '/tutorials/images/num4.png',
    description: (
      <>
        공유하기 버튼을 클릭하여 여러분이 만든 음악을 친구들에게 공유해보세요. 친구들은 여러분이
        만든 음악을 듣고, 수정하고, 다시 공유할 수 있습니다.
      </>
    ),
  },
  {
    number: 5,
    title: 'AI로 멜로디 생성하기',
    isBeta: true,
    image: '/tutorials/images/num5.png',
    description: (
      <>
        뮤트리 AI로 멜로디를 생성해보세요. AI는 여러분이 만든 멜로디를 분석하여 새로운 멜로디를
        생성합니다. AI로 생성된 멜로디는 여러분의 멜로디와 조합하여 더욱 멋진 소리를 들려줍니다.
      </>
    ),
  },
];

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        <Anchor
          inherit
          underline="hover"
          variant="gradient"
          gradient={{ from: 'teal', to: 'cyan' }}
          href="/studio"
        >
          뮤트리
        </Anchor>
        에서 <Mark>너만의 음악</Mark>을 플레이!
      </Title>

      <Stack maw={700} mx="auto" mt="xl" px={20} py="xl" gap="xl">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.number} {...tutorial} />
        ))}
        <Button
          variant="gradient"
          gradient={{ from: 'teal', to: 'cyan' }}
          size="lg"
          fullWidth
          component="a"
          href="/studio"
        >
          뮤트리 시작하기
        </Button>
      </Stack>
    </>
  );
}
