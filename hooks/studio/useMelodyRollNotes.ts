import React from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  scrollLeftAtom,
  resolutionAtom,
  bpmAtom,
  generateMelodyTriggeredAtom,
} from '@/atoms/studio';
import MutreeEvent from '@/classes/MutreeEvent';
import { MutreeAudio, MutreeKey, RollNote } from '@/types/studio';
import { NOTE_WIDTH, STEP_WIDTH } from '@/constants/studio';
import { convertToINoteSequence, getDurationOfSixteenth } from '@/utils/studio';
import * as mm from '@magenta/music';

interface Props {
  idPrefix: string;
  unitHeight: number;
  audio: MutreeAudio;
  keys: MutreeKey[];
}

export default function useRollNotes({ idPrefix, unitHeight, audio, keys }: Props) {
  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const resolution = useRecoilValue(resolutionAtom);
  const bpm = useRecoilValue(bpmAtom);
  const [generateNotesTriggered, setGenerateNotesTriggered] = useRecoilState(
    generateMelodyTriggeredAtom
  );

  const [rollNotes, setRollNotes] = React.useState<RollNote[]>([]);
  const [isRegionLoading, setIsRegionLoading] = React.useState(false);

  const regionRef = React.useRef<HTMLDivElement>(null);
  const noteIdRef = React.useRef(0);

  const getNoteId = React.useCallback(() => {
    noteIdRef.current += 1;
    return `${idPrefix}-note-${noteIdRef.current}`;
  }, [idPrefix]);

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

      const pitch = keys[pitchPosition].pitch;
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
      };

      setRollNotes([...rollNotes, newNote]);
    },
    [getNoteId, audio, keys, rollNotes, scrollLeft, unitHeight, resolution, bpm]
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
      const absoluteX = nextLeft + scrollLeft;
      const timelinePosition = Math.floor(absoluteX / STEP_WIDTH);

      const pitchPosition = Math.floor(nextTop / unitHeight);
      const pitch = keys[pitchPosition].pitch;

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

  const handleDeleteNote = React.useCallback(
    (id: string) => {
      const newNotes = rollNotes.filter((note) => {
        if (note.id === id) {
          note.event.delete();
          return false;
        }
        return true;
      });
      setRollNotes(newNotes);
    },
    [rollNotes]
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
        .then(() => model.infill(noteSequence, { temperature: 0.1 }))
        .then((sample) => {
          const mergedSample = mm.sequences.mergeConsecutiveNotes(sample);

          const newNotes = mergedSample.notes
            ?.map((note, index) => {
              // 이 방식은 한번 더 고민할것
              if (keys.findIndex((key) => key.pitch === note.pitch) === -1) return;

              return {
                id: `${idPrefix}-note-${index}`,
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
              };
            })
            .filter((note) => note !== undefined) as RollNote[];
          setRollNotes(newNotes);
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
    // on unmount
    return () => {
      rollNotes.forEach((note) => note.event.delete());
    };
  }, []);

  return {
    rollNotes,
    regionRef,
    isRegionLoading,
    handleMouseDownRegion,
    handleResizeNote,
    handleDragNote,
    handleDeleteNote,
    handleSetIsResizing,
    handleSetIsDragging,
  };
}
