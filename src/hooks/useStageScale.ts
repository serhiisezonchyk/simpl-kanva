import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
const SCALE_BORDER = { min: 0.1, max: 1 };
const SCALE_SPEED = 1.05;
const getLimitedScale = (currScale: number, min: number, max: number) => Math.max(min, Math.min(max, currScale));
export const useStageScale = () => {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);

  const handleWheel = (e: KonvaEventObject<MouseEvent>) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointerPos = stage?.getPointerPosition();

    if (!pointerPos) return;

    const mousePointTo = {
      x: (pointerPos.x - stage.x()) / oldScale,
      y: (pointerPos.y - stage.y()) / oldScale,
    };
    const newScale = e.evt.deltaY < 0 ? oldScale * SCALE_SPEED : oldScale / SCALE_SPEED;
    const finalScale = getLimitedScale(newScale, SCALE_BORDER.min, SCALE_BORDER.max);

    setStageScale(finalScale);
    setStagePos({
      x: pointerPos.x - mousePointTo.x * finalScale,
      y: pointerPos.y - mousePointTo.y * finalScale,
    });
  };

  return { handleWheel, stagePos, stageScale };
};
