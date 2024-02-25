'use client';

import { RecoilRoot } from 'recoil';
import Studio from '@/components/Studio';
import './studio.css';

export default function StudioPage() {
  return (
    <RecoilRoot>
      <Studio />
    </RecoilRoot>
  );
}
