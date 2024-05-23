import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';
import { useRef, useState } from 'react';
import { Placement, ShapeStyle, Tool } from '../types';
import { getRelativePointerPosition } from '../utils/getRelativePointerPosition';
import { SelectionBox } from '../utils/isShapeSelected';
import { shapeSizing } from '../utils/shapeSizing';
import { Shape, ShapeType } from './../types/index';
interface MouseAreaProps {
  tool: Tool;
  appendShape: (shape: Shape) => void;
  selectShape: (id: string) => void;
  selectShapesInArea: (selectionBox: SelectionBox) => void;
  style: ShapeStyle;
}
const initialSelectedValue = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  visible: false,
  startX: 0,
  startY: 0,
};
export const useMouthArea = ({ tool, appendShape, selectShape, selectShapesInArea, style }: MouseAreaProps) => {
  const [selectedArea, setSelectedArea] = useState(initialSelectedValue);
  const shapePreview = useRef<Shape | null>(null);
  const previewLayerRef = useRef<Konva.Layer | null>(null);
  const mouseDown = useRef(false);
  const shapeDragging = useRef(false);

  const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === Tool.GRAB) return;
    mouseDown.current = true;

    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);

    if (e.target !== stage) {
      const shapeId = e.target.attrs.id;
      selectShape(shapeId);
      shapeDragging.current = true;
      return;
    } else {
      selectShape('');
    }
    if (!pos) return;
    const shapeId = Date.now().toString();

    if (tool === Tool.TEXT) {
      const shape: Shape = {
        id: shapeId,
        type: ShapeType.TEXT,
        x: pos.x,
        y: pos.y,
        text: 'Text',
        ...style,
      };
      appendShape(shape);
      return;
    }

    const selectedArea = {
      visible: true,
      startX: pos.x,
      startY: pos.y,
      width: 0,
      height: 0,
      ...pos,
    };
    setSelectedArea(selectedArea);

    let shape: Shape | null = null;

    if (tool === Tool.RECTANGLE) {
      shape = {
        id: shapeId,
        type: ShapeType.RECTANGLE,
        ...style,
        ...selectedArea,
      };
    }

    if (tool === Tool.CIRCLE) {
      shape = {
        id: shapeId,
        type: ShapeType.CIRCLE,
        ...style,
        radiusX: 0,
        radiusY: 0,
        ...selectedArea,
      };
    }
    if (tool === Tool.PENCIL) {
      shape = {
        id: shapeId,
        type: ShapeType.LINE,
        ...style,
        points: [pos.x, pos.y],
        ...pos,
      };
    }

    if (!shape) return;
    shapePreview.current = shape;

    switch (tool) {
      case Tool.RECTANGLE:
        previewLayerRef.current?.add(new Konva.Rect(shape));
        break;
      case Tool.CIRCLE:
        previewLayerRef.current?.add(new Konva.Ellipse({ ...shape, radiusX: 0, radiusY: 0 }));
        break;
      case Tool.PENCIL:
        previewLayerRef.current?.add(new Konva.Line({ ...shape, x: 0, y: 0, width: 0, height: 0 }));
        break;
      default:
        break;
    }
  };
  const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!mouseDown.current || shapeDragging.current) return;
    if (tool === Tool.GRAB) return;
    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);

    if (!pos) return;

    const { height, width, x, y } = getNewSelectAreaSize(pos, { x: selectedArea.startX, y: selectedArea.startY });

    const rectSelection = shapeSizing.getRectSize({ height, width }, { x, y });
    if (tool === Tool.POINTER) {
      setSelectedArea({ ...selectedArea, ...rectSelection });
      selectShapesInArea(rectSelection);
      return;
    }
    const shape = shapePreview?.current;
    const shapeToEdit = previewLayerRef.current?.findOne(`#${shape?.id}`);

    if (!shapeToEdit || !shape) return;

    if (tool === Tool.RECTANGLE) {
      shapeToEdit.setAttrs(rectSelection);
      shapePreview.current = { ...shape, ...rectSelection };
    }
    if (tool === Tool.CIRCLE) {
      const circleSelection = shapeSizing.getCircleSize({ height, width }, { x, y });
      shapeToEdit.setAttrs(circleSelection);
      shapePreview.current = { ...shape, ...circleSelection };
    }
    if (tool === Tool.PENCIL && shape.type === ShapeType.LINE) {
      const points = shape.points.concat([pos.x, pos.y]);
      shape.points = points;
      shapeToEdit.setAttrs({ points });
    }
    previewLayerRef.current?.batchDraw();
  };
  const onMouseUp = () => {
    mouseDown.current = false;
    shapeDragging.current = false;
    if (tool !== Tool.POINTER && tool !== Tool.GRAB) {
      const shape = shapePreview.current;
      if (!shape) return;
      const shapeToEdit = previewLayerRef.current?.findOne(`#${shape?.id}`);
      shapeToEdit?.destroy();
      previewLayerRef.current?.batchDraw();
      appendShape(shape);
      shapePreview.current = null;
    }
    setSelectedArea(initialSelectedValue);
  };
  return { selectedArea, previewLayerRef, onMouseDown, onMouseUp, onMouseMove };
};

const getNewSelectAreaSize = (start: Placement, end: Placement) => {
  const width = Math.abs(start.x - end.x);
  const height = Math.abs(start.y - end.y);
  const x = (start.x + end.x) / 2;
  const y = (start.y + end.y) / 2;

  return { width, height, x, y };
};
