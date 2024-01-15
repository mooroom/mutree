import * as Tone from 'tone';
import MutreeInstrument from './MutreeInstrument';

type Nullable<T> = T | null;

export interface MutreeEventOptions {
  instrument: Nullable<MutreeInstrument>;
  startStep: number;
  steps: number;
  playOnCreate?: boolean;
}

const BASIC_TIME = '16n';

export default class MutreeEvent<Options extends MutreeEventOptions = MutreeEventOptions> {
  private _event: Tone.ToneEvent;
  private _instrument: Nullable<MutreeInstrument>;
  private _startStep: number;
  private _steps: number;

  constructor(options: Options) {
    const { instrument, startStep, steps, playOnCreate = false } = options;

    if (instrument === null) {
      throw new Error('invalid instrument');
    }

    this._event = new Tone.ToneEvent();
    this._instrument = instrument;
    this._startStep = startStep;
    this._steps = steps;

    if (playOnCreate) {
      this._instrument.playOnce();
    }

    this._event.callback = (t) => {
      this._instrument?.play(this._steps, t);
    };
    this._event.start(this._startStep * Tone.Time(BASIC_TIME).toSeconds());
  }

  // Update the event with new instrument, time and duration
  // update(instrument: Nullable<MutreeInstrument>, time: Time, duration: Time) {
  //   this._instrument = instrument;
  //   this._time = time;
  //   this._duration = duration;

  //   this._event.dispose();
  //   this._event = new Tone.ToneEvent();
  //   this._event.callback = (t) => {
  //     this._instrument?.play(this._duration, t);
  //   };
  //   this._event.start(this._time);

  //   return this;
  // }

  // Update the event with new instrument
  // updateInstrument(instrument: Nullable<MutreeInstrument>) {
  //   this.update(instrument, this._time, this._duration);

  //   return this;
  // }

  // Update the instrument or the time of the event
  // updateInstrumentOrTime(instrument: Nullable<MutreeInstrument>, time: Time) {
  //   this.update(instrument, time, this._duration);

  //   return this;
  // }

  // Update the duration of the event
  // updateDuration(duration: Time) {
  //   this.update(this._instrument, this._time, duration);

  //   return this;
  // }

  // Delete the event
  delete() {
    this._event.dispose();
  }

  // Getter and setter methods
  get event() {
    return this._event;
  }

  get instrument() {
    return this._instrument;
  }

  set instrument(instrument: Nullable<MutreeInstrument>) {
    this._instrument = instrument;
  }

  // get time() {
  //   return this._time;
  // }

  // set time(time: Time) {
  //   this._time = time;
  // }

  // get duration() {
  //   return this._duration;
  // }

  // set duration(duration: Time) {
  //   this._duration = duration;
  // }
}
