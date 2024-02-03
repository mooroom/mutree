import { useRecoilValue } from 'recoil';
import { STEP_WIDTH } from '@/constants/studio';
import useScrollLeftCanvasRef from './useScrollLeftCanvasRef';
import { denomAtom, numerAtom } from '@/atoms/studio';

export default function useBeatRulerAxisRef() {
  const numer = useRecoilValue(numerAtom);
  const denom = useRecoilValue(denomAtom);

  const canvasRef = useScrollLeftCanvasRef({
    onDraw: (ctx, canvas, scrollLeft) => {
      const gap = STEP_WIDTH;
      const numLines = Math.ceil(canvas.clientWidth / gap) + 1;

      for (let i = 0; i < numLines; i += 1) {
        const x = i * gap - (scrollLeft % gap);

        const mark = Math.floor((i * gap + scrollLeft) / gap);
        const stepsPerBeat = 16 / denom;
        const isBar = mark % (numer * stepsPerBeat) === 0;

        ctx.beginPath();
        if (isBar) {
          // numer state
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.clientHeight);
          ctx.strokeStyle = '#fff';
          ctx.stroke();

          const barIndicator = Math.floor(mark / (numer * stepsPerBeat));
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(barIndicator.toString(), x + 5, 15);
        } else {
          ctx.moveTo(x, canvas.clientHeight);
          ctx.lineTo(x, canvas.clientHeight / 2);
          ctx.strokeStyle = mark % stepsPerBeat === 0 ? '#fff' : '#fff5';
          ctx.stroke();
        }
      }
    },
  });

  return canvasRef;
}
