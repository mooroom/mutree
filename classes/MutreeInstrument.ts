import { Sampler, SamplerOptions, Time } from 'tone';
import type { Note, Time as TimeType } from 'tone/build/esm/core/type/Units';

export default class MutreeInstrument extends Sampler {
  private _note: Note;

  constructor(note: Note, options?: Partial<SamplerOptions>) {
    super(options);
    this._note = note;
  }

  playOnce() {
    this.triggerAttackRelease(this._note, '16n');
  }

  play(steps: number, time: TimeType) {
    // bpm 바뀌면 이거도 바꿔야 함
    this.triggerAttackRelease(this._note, steps * Time('16n').toSeconds(), time);
  }

  get note() {
    return this._note;
  }

  set note(note: Note) {
    this._note = note;
  }
}
