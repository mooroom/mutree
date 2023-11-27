import { Title, Text, Anchor } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'teal', to: 'cyan' }}>
          뮤트리
        </Text>
        에 오신 것을 환영합니다!
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        <Anchor href="/studio" size="lg">
          여기
        </Anchor>
        에서 뮤트리를 시작해보세요!
      </Text>
    </>
  );
}
