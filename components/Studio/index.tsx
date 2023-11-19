import MutreeAudioProvider from './MutreeAudioProvider';
import StudioHeader from './StudioHeader';
import StudioMain from './StudioMain';

export default function Studio() {
  return (
    <MutreeAudioProvider>
      <StudioHeader />
      <StudioMain />
    </MutreeAudioProvider>
  );
}
