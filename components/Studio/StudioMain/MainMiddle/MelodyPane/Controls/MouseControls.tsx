import { useRecoilState } from 'recoil';
import { melodyMouseControlAtom } from '@/atoms/studio';
import MouseControls from '@/components/shared/MouseControls';

export default function MelodyMouseControls() {
  const [value, setValue] = useRecoilState(melodyMouseControlAtom);

  return <MouseControls value={value} setValue={setValue} />;
}
