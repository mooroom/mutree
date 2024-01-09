import {
  bpmAtom,
  generateMelodyTriggeredAtom,
  generateRhythmTriggeredAtom,
  melodyMouseControlAtom,
  rhythmMouseControlAtom,
  resolutionAtom,
  scrollLeftAtom,
} from '@/atoms/studio';
import MutreeEvent from '@/classes/MutreeEvent';
import { MOUSE_CONTROL_OPTIONS, NOTE_WIDTH, STEP_WIDTH } from '@/constants/studio';
import { MutreeAudio, MutreeKey, RollNote, Layer } from '@/types/studio';
import { convertToINoteSequence, getDurationOfSixteenth } from '@/utils/studio';
import * as mm from '@magenta/music';
import React from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';

interface Props {
  layer: Layer;
  unitHeight: number;
  audio: MutreeAudio;
  keys: MutreeKey[];
}

const CONSTANTS = {
  melody: {
    idPrefix: 'melody',
    generateNotesTriggeredAtom: generateMelodyTriggeredAtom,
    mouseControlAtom: melodyMouseControlAtom,
    localStorageKey: 'melody-roll-notes',
    urlSearchParam: 'melody',
  },
  rhythm: {
    idPrefix: 'rhythm',
    generateNotesTriggeredAtom: generateRhythmTriggeredAtom,
    mouseControlAtom: rhythmMouseControlAtom,
    localStorageKey: 'rhythm-roll-notes',
    urlSearchParam: 'rhythm',
  },
};

export default function useRollNotes({ layer, unitHeight, audio, keys }: Props) {
  const resolution = useRecoilValue(resolutionAtom);
  const bpm = useRecoilValue(bpmAtom);

  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const [generateNotesTriggered, setGenerateNotesTriggered] = useRecoilState(
    CONSTANTS[layer].generateNotesTriggeredAtom
  );

  const [rollNotes, setRollNotes] = React.useState<RollNote[]>([]);
  const [isRegionLoading, setIsRegionLoading] = React.useState(false);
  const [isIntializedByUrl, setIsIntializedByUrl] = React.useState(false);

  const regionRef = React.useRef<HTMLDivElement>(null);
  const noteIdRef = React.useRef(0);

  const getNoteId = () => {
    noteIdRef.current += 1;
    return `${CONSTANTS[layer].idPrefix}-note-${noteIdRef.current}`;
  };

  const addNote = (note: RollNote) => {
    setRollNotes((prev) => [...(prev.map((n) => ({ ...n, isSelected: false })) || []), note]);
  };

  const deleteNote = (id: string) => {
    setRollNotes((prev) =>
      prev.filter((note) => {
        note.isSelected = false;

        if (note.id === id) {
          note.event.delete();
          return false;
        }
        return true;
      })
    );
  };

  const handleMouseDownRegion = useRecoilCallback(
    ({ snapshot }) =>
      (e: React.MouseEvent<HTMLDivElement>) => {
        const region = regionRef.current;
        if (!region) return;

        const mouseControlValue = snapshot.getLoadable(CONSTANTS[layer].mouseControlAtom).contents;
        if (mouseControlValue === MOUSE_CONTROL_OPTIONS.POINTER) return;

        const offsetX = e.clientX - region.getBoundingClientRect().left;
        const offsetY = e.clientY - region.getBoundingClientRect().top;

        const absoluteX = offsetX + scrollLeft;
        const timelinePosition = Math.floor(absoluteX / STEP_WIDTH);
        const pitchPosition = Math.floor(offsetY / unitHeight);

        const snapLeft = timelinePosition * STEP_WIDTH;
        const snapTop = pitchPosition * unitHeight;

        const { pitch } = keys[pitchPosition];
        const inst = audio[pitch];

        const steps = NOTE_WIDTH[resolution] / STEP_WIDTH;
        const startTime = timelinePosition * getDurationOfSixteenth(bpm);
        const duration = (NOTE_WIDTH[resolution] / STEP_WIDTH) * getDurationOfSixteenth(bpm);

        const newNote: RollNote = {
          id: getNoteId(),
          left: snapLeft,
          top: snapTop,
          steps,
          event: new MutreeEvent(inst, startTime, duration),
          pitch,
          startStep: timelinePosition,
          endStep: timelinePosition + steps,
          isSelected: true,
        };

        addNote(newNote);
      },
    [getNoteId, audio, keys, unitHeight, resolution, bpm, scrollLeft]
  );

  const handleMouseDownNote = useRecoilCallback(
    ({ snapshot }) =>
      (id: string, shiftKeyPressed: boolean) => {
        const mouseControlValue = snapshot.getLoadable(melodyMouseControlAtom).contents;

        if (mouseControlValue === MOUSE_CONTROL_OPTIONS.ERASER) {
          deleteNote(id);
          return;
        }

        if (!shiftKeyPressed) {
          setRollNotes((prev) =>
            prev.map((note) => {
              if (note.id === id) {
                return {
                  ...note,
                  isSelected: true,
                };
              }
              return {
                ...note,
                isSelected: false,
              };
            })
          );
        } else {
          setRollNotes((prev) =>
            prev.map((note) => {
              if (note.id === id) {
                return {
                  ...note,
                  isSelected: !note.isSelected,
                };
              }
              return note;
            })
          );
        }
      },
    []
  );

  const handleResizeNote = (id: string, nextSteps: number) => {
    setRollNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            steps: nextSteps,
            event: note.event.updateDuration(nextSteps * getDurationOfSixteenth(bpm)),
            endStep: note.startStep + nextSteps,
          };
        }
        return note;
      })
    );
  };

  const handleDragNote = (id: string, nextLeft: number, nextTop: number) => {
    const absoluteX = nextLeft + scrollLeft;
    const timelinePosition = Math.floor(absoluteX / STEP_WIDTH);

    const pitchPosition = Math.floor(nextTop / unitHeight);
    const { pitch } = keys[pitchPosition];

    setRollNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            left: nextLeft,
            top: nextTop,
            event: note.event.updateInstrumentOrTime(
              audio[pitch],
              timelinePosition * getDurationOfSixteenth(bpm)
            ),
            pitch,
            startStep: timelinePosition,
            endStep: timelinePosition + note.steps,
          };
        }
        return note;
      })
    );
  };

  React.useEffect(() => {
    setRollNotes((prev) =>
      prev.map((note) => ({
        ...note,
        event: note.event.updateInstrument(audio[keys[Math.floor(note.top / unitHeight)].pitch]),
      }))
    );
  }, [audio, keys, unitHeight]);

  React.useEffect(() => {
    // 여기는 rhythm 케이스에서 추후에 수정해야함
    if (!generateNotesTriggered) return;

    setIsRegionLoading(true);
    setScrollLeft(0);

    // get the total quantized steps: highest endStep
    const totalQuantizedSteps = rollNotes.reduce((acc, note) => {
      if (note.endStep! > acc) {
        return note.endStep!;
      }
      return acc;
    }, 0);

    const noteSequence = convertToINoteSequence(rollNotes, totalQuantizedSteps);
    const model = new mm.Coconet(
      'https://storage.googleapis.com/magentadata/js/checkpoints/coconet/bach'
    );
    model
      .initialize()
      .then(() => model.infill(noteSequence, { temperature: 0.99 }))
      .then((sample) => {
        const mergedSample = mm.sequences.mergeConsecutiveNotes(sample);

        const newNotes = mergedSample.notes
          ?.map((note) => {
            // 이 방식은 한번 더 고민할것
            if (keys.findIndex((key) => key.pitch === note.pitch) === -1) return;

            // eslint-disable-next-line consistent-return
            return {
              id: getNoteId(),
              left: STEP_WIDTH * note.quantizedStartStep!,
              top: unitHeight * keys.findIndex((key) => key.pitch === note.pitch),
              steps: note.quantizedEndStep! - note.quantizedStartStep!,
              event: new MutreeEvent(
                audio[note.pitch!],
                note.quantizedStartStep! * getDurationOfSixteenth(bpm),
                (note.quantizedEndStep! - note.quantizedStartStep!) * getDurationOfSixteenth(bpm),
                false
              ),
              pitch: note.pitch,
              startStep: note.quantizedStartStep,
              endStep: note.quantizedEndStep,
              isAI: true,
            };
          })
          .filter((note) => note !== undefined) as RollNote[];

        // merge with original notes
        setRollNotes([...rollNotes, ...newNotes]);

        setIsRegionLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsRegionLoading(false);
      })
      .finally(() => {
        setGenerateNotesTriggered(false);
      });
  }, [generateNotesTriggered, rollNotes, audio, keys, unitHeight, scrollLeft, bpm]);

  React.useEffect(() => {
    if (!isIntializedByUrl) return;

    const data = rollNotes.map((note) => {
      const { left, top, steps, pitch, startStep, endStep } = note;
      return {
        left,
        top,
        steps,
        pitch,
        startStep,
        endStep,
      };
    });

    localStorage.setItem(CONSTANTS[layer].localStorageKey, JSON.stringify(data));
  }, [rollNotes, isIntializedByUrl]);

  React.useEffect(() => {
    if (isIntializedByUrl) return;

    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(CONSTANTS[layer].urlSearchParam);
    if (!encoded) {
      setIsIntializedByUrl(true);
      return;
    }

    const decoded = JSON.parse(atob(encoded));

    const newNotes = decoded.map((note: any) => {
      const { left, top, steps, pitch, startStep, endStep } = note;
      return {
        id: getNoteId(),
        left,
        top,
        steps,
        event: new MutreeEvent(
          audio[pitch],
          startStep * getDurationOfSixteenth(bpm),
          steps * getDurationOfSixteenth(bpm),
          false
        ),
        pitch,
        startStep,
        endStep,
      };
    });

    setRollNotes(newNotes);
    setIsIntializedByUrl(true);
  }, [isIntializedByUrl]);

  return {
    rollNotes,
    regionRef,
    isRegionLoading,
    handleMouseDownRegion,
    handleMouseDownNote,
    handleResizeNote,
    handleDragNote,
  };
}
