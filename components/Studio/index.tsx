// @ts-nocheck

import MutreeAudioProvider from './MutreeAudioProvider';
import StudioHeader from './StudioHeader';
import dynamic from 'next/dynamic';

const StudioMain = dynamic(() => import('./StudioMain'), { ssr: false });

export default function Studio() {
  return (
    <MutreeAudioProvider>
      <StudioHeader />
      <StudioMain />
    </MutreeAudioProvider>
  );
}
