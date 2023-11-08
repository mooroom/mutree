import Image from 'next/image';
import classes from './StudioHeader.module.css';

export default function StudioHeader() {
  return (
    <header className={classes.container}>
      <Image src="/logo.svg" alt="logo" width={106} height={36} />
    </header>
  );
}
