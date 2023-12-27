import { Button } from '@mantine/core';
import { IconPencil, IconPointer, IconTrash } from '@tabler/icons-react';
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
        <IconTrash size={14} />
      </Button>
    </Button.Group>
  );
}
