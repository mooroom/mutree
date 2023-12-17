// @ts-nocheck

import dynamic from 'next/dynamic';
import MutreeAudioProvider from './MutreeAudioProvider';
import StudioHeader from './StudioHeader';

const StudioMain = dynamic(() => import('./StudioMain'), { ssr: false });

export default function Studio() {
  return (
    <MutreeAudioProvider>
      <StudioHeader />
      <StudioMain />
    </MutreeAudioProvider>
  );
}
