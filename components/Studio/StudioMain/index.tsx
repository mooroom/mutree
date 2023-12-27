import { LoadingOverlay } from '@mantine/core';
import MainTop from './MainTop';
import MainMiddle from './MainMiddle';
import MainBottom from './MainBottom';
import classes from './StudioMain.module.css';
import { useMutreeAudioContext } from '../MutreeAudioProvider';

export default function StudioMain() {
  const { isAudioLoaded } = useMutreeAudioContext();

  if (!isAudioLoaded) {
    return (
      <div className={classes.container}>
        <LoadingOverlay visible />
      </div>
    );
  }

  return (
    <main className={classes.container}>
      <MainTop />
      <MainMiddle />
      <MainBottom />
    </main>
  );
}
