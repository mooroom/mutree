import classes from './index.module.css';
import Lane from './Lane';
import Controls from './Controls';

export default function RhythmPane() {
  return (
    <div className={classes.rhythmPane}>
      <div className={classes.paneLeft}>
        <div className={classes.paneLeftTop}>
          <Controls />
        </div>
      </div>
      <div className={classes.paneRight}>
        <Lane />
      </div>
    </div>
  );
}
