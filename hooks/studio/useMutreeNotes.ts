import * as mm from '@magenta/music';
import React from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import {
  generateMelodyTriggeredAtom,
  generateRhythmTriggeredAtom,
  melodyMouseControlAtom,
  rhythmMouseControlAtom,
  resolutionAtom,
  scrollLeftAtom,
} from '@/atoms/studio';
import MutreeEvent, { MutreeEventOptions } from '@/classes/MutreeEvent';
import { MOUSE_CONTROL_OPTIONS, NOTE_WIDTH, STEP_WIDTH } from '@/constants/studio';
import { MutreeAudio, MutreeKey, MutreeNote, Layer } from '@/types/studio';
import { convertToINoteSequence } from '@/utils/studio';

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

export default function useMutreeNotes({ layer, unitHeight, audio, keys }: Props) {
  const resolution = useRecoilValue(resolutionAtom);

  const [scrollLeft, setScrollLeft] = useRecoilState(scrollLeftAtom);
  const [generateNotesTriggered, setGenerateNotesTriggered] = useRecoilState(
    CONSTANTS[layer].generateNotesTriggeredAtom
  );

  const [mutreeNotes, setMutreeNotes] = React.useState<MutreeNote[]>([]);
  const [clipboard, setClipboard] = React.useState<Omit<MutreeNote, 'id'>[]>([]);
  const [mutreeEvents, setMutreeEvents] = React.useState<MutreeEvent[]>([]);
  const [isRegionLoading, setIsRegionLoading] = React.useState(false);
  const [isIntializedByUrl, setIsIntializedByUrl] = React.useState(false);

  // const [isAltKeyPressed, setIsAltKeyPressed] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const ifAltKeyPressedRef = React.useRef(false);
  const isDragCopyRef = React.useRef(false);

  const regionRef = React.useRef<HTMLDivElement>(null);
  const noteIdRef = React.useRef(0);

  const getNoteId = () => {
    noteIdRef.current += 1;
    return `${CONSTANTS[layer].idPrefix}-note-${noteIdRef.current}`;
  };

  const unSelectNotes = (notes: MutreeNote[]) =>
    notes.map((note) => ({ ...note, isSelected: false }));

  const addNote = (newNote: MutreeNote) => {
    setMutreeNotes((prev) => unSelectNotes(prev).concat(newNote));
  };

  const multiSelectNote = (id: string) => {
    setMutreeNotes((prev) =>
      prev.map((note) => {
        if (note.id === id) {
          return {
            ...note,
            isSelected: true,
          };
        }
        return note;
      })
    );
  };

  const singleSelectNote = (id: string) => {
    setMutreeNotes((prev) =>
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
  };

  const changeNoteLength = (dLength: number) => {
    setMutreeNotes((prev) =>
      prev.map((note) => {
        if (note.isSelected) {
          return {
            ...note,
            length: note.length + dLength,
          };
        }
        return note;
      })
    );
  };

  const changeNotePosition = (dx: number, dy: number) => {
    if (ifAltKeyPressedRef.current && !isDragCopyRef.current) {
      setMutreeNotes((prev) => unSelectNotes(prev));
      setClipboard(() => {
        const newClipboard = mutreeNotes
          .filter((note) => note.isSelected)
          .map(({ id, ...rest }) => ({
            ...rest,
            x: rest.x + dx,
            y: rest.y + dy,
          }));

        return newClipboard;
      });

      isDragCopyRef.current = true;
      return;
    }

    if (isDragCopyRef.current) {
      setClipboard((prevClipboard) =>
        prevClipboard.map((note) => ({
          ...note,
          x: note.x + dx,
          y: note.y + dy,
        }))
      );
      return;
    }

    setMutreeNotes((prev) =>
      prev.map((note) => {
        if (note.isSelected) {
          return {
            ...note,
            x: note.x + dx,
            y: note.y + dy,
          };
        }
        return note;
      })
    );
  };

  const deleteNoteById = (id: string) => {
    setMutreeNotes((prev) => unSelectNotes(prev).filter((note) => note.id !== id));
  };

  const deleteNotesBySelected = () => {
    setMutreeNotes((prev) => prev.filter((note) => !note.isSelected));
  };

  const handleDeleteSelectedNotes = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace') deleteNotesBySelected();
  };

  const handleMouseDownRegion = useRecoilCallback(
    ({ snapshot }) =>
      (e: React.MouseEvent<HTMLDivElement>) => {
        const region = regionRef.current;
        if (!region) return;

        const mouseControlValue = snapshot.getLoadable(CONSTANTS[layer].mouseControlAtom).contents;
        const isAddNoteMode = mouseControlValue === MOUSE_CONTROL_OPTIONS.PENCIL;
        if (!isAddNoteMode) return;

        const offsetX = e.clientX - region.getBoundingClientRect().left;
        const offsetY = e.clientY - region.getBoundingClientRect().top;

        const absoluteX = offsetX + scrollLeft;

        const coordX = Math.floor(absoluteX / STEP_WIDTH);
        const coordY = Math.floor(offsetY / unitHeight);
        const steps = NOTE_WIDTH[resolution] / STEP_WIDTH;

        const newNote: MutreeNote = {
          id: getNoteId(),
          x: coordX,
          y: coordY,
          length: steps,
          isSelected: true,
        };

        audio[keys[coordY].pitch]?.playOnce();
        addNote(newNote);
      },
    [scrollLeft, unitHeight, resolution, audio, keys]
  );

  const handleMouseDownNote = useRecoilCallback(
    ({ snapshot }) =>
      (id: string, shiftKeyPressed: boolean) => {
        const mouseControlValue = snapshot.getLoadable(CONSTANTS[layer].mouseControlAtom).contents;

        if (mouseControlValue === MOUSE_CONTROL_OPTIONS.ERASER) {
          deleteNoteById(id);
          return;
        }

        if (shiftKeyPressed) {
          multiSelectNote(id);
        } else {
          const clickedSelectedNote = mutreeNotes.find((note) => note.id === id && note.isSelected);
          if (clickedSelectedNote) return;

          singleSelectNote(id);
        }
      },
    [mutreeNotes]
  );

  const handleResizeNote = (dLength: number) => {
    changeNoteLength(dLength);
  };

  const handleDragNote = (dx: number, dy: number) => {
    changeNotePosition(dx, dy);
  };

  const handleSetIsDragging = (value: boolean) => {
    setIsDragging(value);
  };

  // detect alt key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        ifAltKeyPressedRef.current = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        ifAltKeyPressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mutreeNotes]);

  // release all notes when mouse up
  React.useEffect(() => {
    if (!isDragging && clipboard.length > 0) {
      const newNotes = clipboard.map((note) => ({
        ...note,
        id: getNoteId(),
        isSelected: true,
      }));

      setMutreeNotes((prev) => unSelectNotes(prev).concat(newNotes));
      setClipboard([]);

      isDragCopyRef.current = false;
    }
  }, [isDragging, clipboard]);

  // watch mutreeNotes -> mutreeEvents
  React.useEffect(() => {
    const newEventOptionsArray: MutreeEventOptions[] = mutreeNotes.map((note) => {
      const { x, y, length } = note;
      const { pitch } = keys[y];

      return {
        instrument: audio[pitch],
        startStep: x,
        steps: length,
        playOnCreate: false,
      };
    });

    mutreeEvents.forEach((e) => e.delete());
    setMutreeEvents(newEventOptionsArray.map((options) => new MutreeEvent(options)));
  }, [mutreeNotes, keys, audio]);

  React.useEffect(() => {
    // 여기는 rhythm 케이스에서 추후에 수정해야함
    if (!generateNotesTriggered) return;

    setIsRegionLoading(true);
    setScrollLeft(0);

    // get the total quantized steps: highest endStep
    const totalQuantizedSteps = mutreeNotes.reduce((acc, note) => {
      if (note.x + note.length > acc) {
        return note.x + note.length;
      }
      return acc;
    }, 0);

    const noteSequence = convertToINoteSequence(mutreeNotes, keys, totalQuantizedSteps);
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
              x: note.quantizedStartStep!,
              y: keys.findIndex((key) => key.pitch === note.pitch),
              length: note.quantizedEndStep! - note.quantizedStartStep!,
              isSelected: false,
              isAI: true,
            };
          })
          .filter((note) => note !== undefined) as MutreeNote[];

        // merge with original notes
        setMutreeNotes([...mutreeNotes, ...newNotes]);

        setIsRegionLoading(false);
      })
      .catch((e) => {
        // console.log(error);
        throw new Error(e);
        setIsRegionLoading(false);
      })
      .finally(() => {
        setGenerateNotesTriggered(false);
      });
  }, [generateNotesTriggered, mutreeNotes, keys, audio, setGenerateNotesTriggered, setScrollLeft]);

  React.useEffect(() => {
    if (!isIntializedByUrl) return;

    // stringifiy data as a string e.g. "x:y:length,x:y:length,..."
    const data = mutreeNotes.map((note) => `${note.x}:${note.y}:${note.length}`).join(',');

    localStorage.setItem(CONSTANTS[layer].localStorageKey, data);
  }, [mutreeNotes, isIntializedByUrl]);

  React.useEffect(() => {
    if (isIntializedByUrl) return;

    const url = new URL(window.location.href);
    const encoded = url.searchParams.get(CONSTANTS[layer].urlSearchParam);
    if (!encoded) {
      setIsIntializedByUrl(true);
      return;
    }

    const newNotes: MutreeNote[] = encoded.split(',').map((note) => {
      const [x, y, length] = note.split(':').map(Number);
      return {
        id: getNoteId(),
        x,
        y,
        length,
        isSelected: false,
      };
    });

    setMutreeNotes(newNotes);
    setIsIntializedByUrl(true);
  }, [layer, isIntializedByUrl]);

  return {
    mutreeNotes,
    clipboardNotes: clipboard,
    regionRef,
    isRegionLoading,
    handleMouseDownRegion,
    handleMouseDownNote,
    handleResizeNote,
    handleDragNote,
    handleSetIsDragging,
    handleDeleteSelectedNotes,
  };
}
