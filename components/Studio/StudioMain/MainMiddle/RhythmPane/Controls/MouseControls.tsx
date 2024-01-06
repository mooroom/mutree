import { useRecoilState } from 'recoil';
import { rhythmMouseControlAtom } from '@/atoms/studio';
import MouseControls from '@/components/shared/MouseControls';

export default function RhythmMouseControls() {
  const [value, setValue] = useRecoilState(rhythmMouseControlAtom);

  return <MouseControls value={value} setValue={setValue} />;
}
