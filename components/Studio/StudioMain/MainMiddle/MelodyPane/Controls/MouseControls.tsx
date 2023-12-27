import { Button } from '@mantine/core';
import { IconEraser, IconPencil, IconPointer } from '@tabler/icons-react';
import usePickOne from '@/hooks/studio/usePickOne';

export default function MouseControls() {
  const [value, setValue] = usePickOne(['pointer', 'pencil', 'eraser']);

  return (
    <Button.Group>
      <Button
        color="gray"
        variant={value === 'pointer' ? 'light' : 'default'}
        fullWidth
        onClick={() => setValue('pointer')}
      >
        <IconPointer size={14} />
      </Button>
      <Button
        color="gray"
        variant={value === 'pencil' ? 'light' : 'default'}
        fullWidth
        onClick={() => setValue('pencil')}
      >
        <IconPencil size={14} />
      </Button>
      <Button
        color="gray"
        variant={value === 'eraser' ? 'light' : 'default'}
        fullWidth
        onClick={() => setValue('eraser')}
      >
        <IconEraser size={14} />
      </Button>
    </Button.Group>
  );
}
