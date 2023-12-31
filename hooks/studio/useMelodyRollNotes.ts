import {
  bpmAtom,
  generateMelodyTriggeredAtom,
  melodyMouseControlAtom,
  resolutionAtom,
  scrollLeftAtom,
} from '@/atoms/studio';
import MutreeEvent from '@/classes/MutreeEvent';
import { MOUSE_CONTROL_OPTIONS, NOTE_WIDTH, STEP_WIDTH } from '@/constants/studio';
import { MutreeAudio, MutreeKey, RollNote } from '@/types/studio';
import { convertToINoteSequence, getDurationOfSixteenth } from '@/utils/studio';
import * as mm from '@magenta/music';
import React from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';

interface Props {
  idPrefix: string;
  unitHeight: number;
  audio: MutreeAudio;
  keys: MutreeKey[];
}

export default function useMelodyRollNotes({ idPrefix, unitHeight, audio, keys }: Props) {
  const resolution = useRecoilValue(resolutionAtom);
  const bpm = useRecoilValue(bpmAtom);
  const mouseControl = useRecoilValue(melodyMouseControlAtom);

  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const [generateNotesTriggered, setGenerateNotesTriggered] = useRecoilState(
    generateMelodyTriggeredAtom
  );

  const [rollNotes, setRollNotes] = React.useState<RollNote[]>([]);
  // fixme: 필요없다고 판단되면 제거
  // const [selectedNoteIds, setSelectedNoteIds] = React.useState<string[]>([]);
  const [isRegionLoading, setIsRegionLoading] = React.useState(false);
  const [isIntializedByUrl, setIsIntializedByUrl] = React.useState(false);

  const regionRef = React.useRef<HTMLDivElement>(null);
  const noteIdRef = React.useRef(0);

  const getNoteId = React.useCallback(() => {
    noteIdRef.current += 1;
    return `${idPrefix}-note-${noteIdRef.current}`;
  }, [idPrefix]);

  const deleteNote = (id: string) => {
    setRollNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleMouseDownRegion = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const region = regionRef.current;
      if (!region) return;

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

      // setSelectedNoteIds([newNote.id]);
      const updatedRollNotes = rollNotes.map((note) => ({ ...note, isSelected: false }));
      setRollNotes([...updatedRollNotes, newNote]);
    },
    [getNoteId, audio, keys, rollNotes, scrollLeft, unitHeight, resolution, bpm]
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

  const handleResizeNote = React.useCallback(
    (id: string, nextSteps: number) => {
      const newNotes = rollNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            steps: nextSteps,
            event: note.event.updateDuration(nextSteps * getDurationOfSixteenth(bpm)),
            endStep: note.startStep + nextSteps,
          };
        }
        return note;
      });

      setRollNotes(newNotes);
    },
    [rollNotes, bpm]
  );

  const handleDragNote = React.useCallback(
    (id: string, nextLeft: number, nextTop: number) => {
      console.log('dragging');
      console.log(rollNotes[0]);
      const absoluteX = nextLeft + scrollLeft;
      const timelinePosition = Math.floor(absoluteX / STEP_WIDTH);

      const pitchPosition = Math.floor(nextTop / unitHeight);
      const { pitch } = keys[pitchPosition];

      const newNotes = rollNotes.map((note) => {
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
      });

      setRollNotes(newNotes);
    },
    [rollNotes, audio, keys, unitHeight, scrollLeft, bpm]
  );

  const handleSetIsResizing = React.useCallback((resizing: boolean) => {
    if (resizing) {
      regionRef.current?.style.setProperty('cursor', 'col-resize');
    } else {
      regionRef.current?.style.setProperty('cursor', 'pointer');
    }
  }, []);

  const handleSetIsDragging = React.useCallback((dragging: boolean) => {
    if (dragging) {
      regionRef.current?.style.setProperty('cursor', 'grabbing');
    } else {
      regionRef.current?.style.setProperty('cursor', 'pointer');
    }
  }, []);

  React.useEffect(() => {
    setRollNotes((prev) =>
      prev.map((note) => ({
        ...note,
        event: note.event.updateInstrument(audio[keys[Math.floor(note.top / unitHeight)].pitch]),
      }))
    );
  }, [audio, keys, unitHeight]);

  React.useEffect(() => {
    if (generateNotesTriggered) {
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
    }
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

    localStorage.setItem('melody-roll-notes', JSON.stringify(data));
  }, [rollNotes, isIntializedByUrl]);

  React.useEffect(() => {
    if (isIntializedByUrl) return;

    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('melody');
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

  React.useEffect(() => {
    console.log(rollNotes);
  }, [rollNotes]);

  React.useEffect(() => {
    console.log(mouseControl);
  }, [mouseControl]);

  return {
    rollNotes,
    // selectedNoteIds,
    regionRef,
    isRegionLoading,
    handleMouseDownRegion,
    handleMouseDownNote,
    handleResizeNote,
    handleDragNote,
    handleSetIsResizing,
    handleSetIsDragging,
  };
}
