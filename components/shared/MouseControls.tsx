import { SegmentedControl } from '@mantine/core';
import { IconEraser, IconPencil, IconPointer } from '@tabler/icons-react';
import { MOUSE_CONTROL_OPTIONS } from '@/constants/studio';

interface Props {
  value: string;
  setValue: (value: string) => void;
}

export default function MouseControls({ value, setValue }: Props) {
  return (
    <SegmentedControl
      fullWidth
      value={value}
      onChange={setValue}
      data={[
        { label: <IconPointer size={14} />, value: MOUSE_CONTROL_OPTIONS.POINTER },
        { label: <IconPencil size={14} />, value: MOUSE_CONTROL_OPTIONS.PENCIL },
        { label: <IconEraser size={14} />, value: MOUSE_CONTROL_OPTIONS.ERASER },
      ]}
    />
  );
}
