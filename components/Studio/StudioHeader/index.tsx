import Image from 'next/image';
import classes from './StudioHeader.module.css';
import { Button } from '@mantine/core';
import { IconShare2 } from '@tabler/icons-react';
import { makeUrlFromLocalStorage } from '@/utils/studio';
import { notifications } from '@mantine/notifications';

export default function StudioHeader() {
  const handleClickShare = () => {
    const url = makeUrlFromLocalStorage();
    navigator.clipboard.writeText(url);

    notifications.show({
      title: '클립보드에 복사되었습니다.',
      message: '친구들에게 공유해보세요!',
      color: 'teal',
    });
  };

  return (
    <header className={classes.container}>
      <Image src="/logo.svg" alt="logo" width={106} height={36} />
      <Button
        color="teal.8"
        aria-label="share"
        rightSection={<IconShare2 size={15} />}
        onClick={handleClickShare}
      >
        공유하기
      </Button>
    </header>
  );
}
