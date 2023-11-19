import React from 'react';
import { useRecoilValue } from 'recoil';
import { scrollLeftAtom, resolutionAtom, bpmAtom } from '@/atoms/studio';
import MutreeEvent from '@/classes/MutreeEvent';
import { MutreeAudio, MutreeKey } from '@/types/studio';
import { NOTE_WIDTH, STEP_WIDTH } from '@/constants/studio';
import { getDurationOfSixteenth } from '@/utils/studio';

interface RollNote {
  id: string;
  left: number;
  top: number;
  steps: number;
  event: MutreeEvent;
}

interface Props {
  idPrefix: string;
  unitHeight: number;
  audio: MutreeAudio;
  keys: MutreeKey[];
}

export default function useRollNotes({ idPrefix, unitHeight, audio, keys }: Props) {
  const scrollLeft = useRecoilValue(scrollLeftAtom);
  const resolution = useRecoilValue(resolutionAtom);
  const bpm = useRecoilValue(bpmAtom);

  const [rollNotes, setRollNotes] = React.useState<RollNote[]>([]);

  const regionRef = React.useRef<HTMLDivElement>(null);
  const noteIdRef = React.useRef(0);

  console.log(rollNotes);

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
      console.log(audio);
      console.log(pitch, inst);

      const startTime = timelinePosition * getDurationOfSixteenth(bpm);
      const duration = NOTE_WIDTH[resolution] * getDurationOfSixteenth(bpm);

      const newNote: RollNote = {
        id: getNoteId(),
        left: snapLeft,
        top: snapTop,
        steps: NOTE_WIDTH[resolution] / STEP_WIDTH,
        event: new MutreeEvent(inst, startTime, duration),
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
            event: note.event.updateDuration(nextSteps * STEP_WIDTH * getDurationOfSixteenth(bpm)),
          };
        }
        return note;
      });

      setRollNotes(newNotes);
    },
    [rollNotes, bpm]
  );

  const handleDragNoteLeft = React.useCallback(
    (id: string, nextLeft: number) => {
      const absoluteX = nextLeft + scrollLeft;
      const timelinePosition = Math.floor(absoluteX / STEP_WIDTH);

      const newNotes = rollNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            left: nextLeft,
            event: note.event.updateTime(timelinePosition * getDurationOfSixteenth(bpm)),
          };
        }
        return note;
      });

      setRollNotes(newNotes);
    },
    [rollNotes, bpm]
  );

  const handleDragNoteTop = React.useCallback(
    (id: string, nextTop: number) => {
      const pitchPosition = Math.floor(nextTop / unitHeight);
      const pitch = keys[pitchPosition].pitch;

      const newNotes = rollNotes.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            top: nextTop,
            event: note.event.updateInstrument(audio[pitch]),
          };
        }
        return note;
      });

      setRollNotes(newNotes);
    },
    [rollNotes, audio, keys, unitHeight]
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
    // on unmount
    return () => {
      rollNotes.forEach((note) => note.event.delete());
    };
  }, [rollNotes]);

  return {
    rollNotes,
    regionRef,
    handleMouseDownRegion,
    handleResizeNote,
    handleDragNoteLeft,
    handleDragNoteTop,
    handleDeleteNote,
    handleSetIsResizing,
    handleSetIsDragging,
  };
}
