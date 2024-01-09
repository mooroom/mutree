import { useMantineTheme } from '@mantine/core';
import useScrollLeftCanvasRef from './useScrollLeftCanvasRef';
import { denomAtom } from '@/atoms/studio';
import { useRecoilValue } from 'recoil';
import { STEP_WIDTH } from '@/constants/studio';

interface Props {
  numUnits: number;
  unitHeight: number;
  highlightColor?: string;
}

export default function useGridLinesRef({ numUnits, unitHeight, highlightColor }: Props) {
  const theme = useMantineTheme();
  const denom = useRecoilValue(denomAtom);

  const canvasRef = useScrollLeftCanvasRef({
    onDraw: (ctx, canvas, scrollLeft) => {
      const laneWidth = canvas.clientWidth;
      const laneColors = [theme.colors.gray[3], theme.colors.gray[4]];

      for (let i = 0; i < numUnits; i += 1) {
        const y = i * unitHeight;
        const color = laneColors[i % 2];
        ctx.fillStyle = color;
        ctx.fillRect(0, y, laneWidth, unitHeight);
      }

      if (highlightColor) {
        for (let i = 0; i < numUnits; i += 7) {
          const y = i * unitHeight;
          ctx.fillStyle = highlightColor;
          ctx.fillRect(0, y, laneWidth, unitHeight);
        }
      }

      const gap = STEP_WIDTH;
      const numLines = Math.ceil(canvas.clientWidth / gap) + 1;

      for (let i = 0; i < numLines; i++) {
        const x = i * gap - (scrollLeft % gap);

        const mark = Math.floor((i * gap + scrollLeft) / gap);
        const stepsPerBeat = 16 / denom;

        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.clientHeight);
        ctx.strokeStyle = mark % stepsPerBeat === 0 ? '#fff' : '#fff5';
        ctx.stroke();
      }
    },
  });

  return canvasRef;
}
