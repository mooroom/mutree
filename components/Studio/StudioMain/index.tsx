import MainTop from './MainTop';
import MainMiddle from './MainMiddle';
import MainBottom from './MainBottom';
import classes from './StudioMain.module.css';

export default function StudioMain() {
  return (
    <main className={classes.container}>
      <MainTop />
      <MainMiddle />
      <MainBottom />
    </main>
  );
}
