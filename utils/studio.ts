import * as Tone from 'tone';
import { TOTAL_STEPS, TOTAL_WIDTH } from '@/constants/studio';

// time utils
export function formatTimer(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor(time * 10) % 10;

  const minutesString = minutes.toString().padStart(2, '0');
  const secondsString = seconds.toString().padStart(2, '0');

  return `${minutesString}:${secondsString}.${milliseconds}`;
}

export function getDurationOfSixteenth(bpm: number) {
  return 1 / ((bpm / 60) * 4);
}

export function getAbsoluteScrollLeftPosition(bpm: number) {
  const currentTime = Tone.Transport.seconds;
  const totalTime = TOTAL_STEPS * getDurationOfSixteenth(bpm);

  return (currentTime / totalTime) * TOTAL_WIDTH;
}
