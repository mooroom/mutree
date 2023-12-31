import React from 'react';
import { useRecoilValue } from 'recoil';
import { scrollLeftAtom, resolutionAtom, bpmAtom } from '@/atoms/studio';
import MutreeEvent from '@/classes/MutreeEvent';
import { MutreeAudio, MutreeKey, RollNote } from '@/types/studio';
import { NOTE_WIDTH, STEP_WIDTH } from '@/constants/studio';
import { getDurationOfSixteenth } from '@/utils/studio';

interface Props {
  idPrefix: string;
  unitHeight: number;
  audio: MutreeAudio;
  keys: MutreeKey[];
}

export default function useRhythmRollNotes({ idPrefix, unitHeight, audio, keys }: Props) {
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const resolution = useRecoilValue(resolutionAtom);
  const bpm = useRecoilValue(bpmAtom);

  const [rollNotes, setRollNotes] = React.useState<RollNote[]>([]);
  const [isIntializedByUrl, setIsIntializedByUrl] = React.useState(false);

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

    localStorage.setItem('rhythm-roll-notes', JSON.stringify(data));
  }, [rollNotes, isIntializedByUrl]);

  React.useEffect(() => {
    if (isIntializedByUrl) return;

    const url = new URL(window.location.href);
    const encoded = url.searchParams.get('rhythm');
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
    handleMouseDownRegion,
    handleResizeNote,
    handleDragNote,
    handleDeleteNote,
    handleSetIsResizing,
    handleSetIsDragging,
  };
}
