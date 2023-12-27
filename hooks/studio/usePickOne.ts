import React from 'react';

export default function usePickOne<T = string>(
  options: readonly T[]
): readonly [T, (value: React.SetStateAction<T>) => void] {
  const [value, setValue] = React.useState<T>(options[0]);

  return [value, setValue];
}
