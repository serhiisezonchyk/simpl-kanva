import { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ShapeOptions from './components/ShapeOptions';
import Shapes from './components/Shapes';
import Toolbar from './components/Toolbar';
import { useMouthArea } from './hooks/useMouseArea';
import { useStageScale } from './hooks/useStageScale';
import { useTool } from './hooks/useTool';
import { Shape, ShapeStyle, Tool } from './types';
import { Ls } from './utils/Ls';
import { SelectionBox, isShapeSelected } from './utils/isShapeSelected';

function App() {
  const [defaultStyle, setDefaultStyle] = useState<ShapeStyle>({
    fill: 'rgba(0,0,0,0)',
    stroke: 'rgba(0,0,0,1)',
    strokeWidth: 1,
    fontSize: 20,
    cornerRadius: 10,
  });
  const ls = new Ls<Shape>('shapes');

  const [shapes, setShapes] = useState<Shape[]>([]);
  const { tool, setTool } = useTool();
  const { handleWheel, stagePos, stageScale } = useStageScale();

  const appendShape = useCallback((shape: Shape) => {
    setShapes((prev) => {
      const newState = [...prev, shape];
      ls.setItem(newState);
      return newState;
    });
  }, []);

  const selectShape = useCallback((id: string) => {
    setShapes((prev) => {
      const newState = prev.map((shape) => ({ ...shape, selected: shape.id === id }));
      ls.setItem(newState);
      return newState;
    });
  }, []);

  const selectShapesInArea = useCallback((selectionBox: SelectionBox) => {
    setShapes((prev) => prev.map((shape) => ({ ...shape, selected: isShapeSelected(shape, selectionBox) })));
  }, []);

  const { previewLayerRef, selectedArea, ...handlers } = useMouthArea({
    tool,
    appendShape,
    selectShape,
    selectShapesInArea,
    style: defaultStyle,
  });

  const handleShapeDragEnd = useCallback((e: KonvaEventObject<MouseEvent>) => {
    const shapeId = e.target.attrs.id;
    setShapes((prev) => {
      const newState = prev.map((shape) =>
        shape.id === shapeId ? { ...shape, x: e.target.x(), y: e.target.y() } : shape,
      );
      ls.setItem(newState);
      return newState;
    });
  }, []);

  const deleteShapes = useCallback(() => {
    setShapes((prev) => {
      const newState = prev.filter((shape) => !shape.selected);
      ls.setItem(newState);
      return newState;
    });
  }, []);

  const activeShapes = useMemo(() => shapes.filter((s) => s.selected), [shapes]);

  useEffect(() => {
    ls.getData();
    setShapes(ls.data);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

      if (e.key === 'Backspace' && activeShapes.length > 0 && !isInputActive) {
        deleteShapes();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [activeShapes.length, deleteShapes]);

  return (
    <main className="relative w-full">
      <Toolbar activeTool={tool} onChange={setTool} />
      <ShapeOptions
        style={defaultStyle}
        deleteShapes={deleteShapes}
        onApplyStyles={(style) => {
          setDefaultStyle((prev) => ({ ...prev, ...style }));
          setShapes((prev) => prev.map((shape) => (shape.selected ? { ...shape, ...style } : shape)));
        }}
        activeShapes={activeShapes}
      />
      <Stage
        {...stagePos}
        {...handlers}
        scale={{ x: stageScale, y: stageScale }}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={tool === Tool.GRAB}
        style={{ cursor: tool === Tool.GRAB ? 'grab' : 'default' }}
        onWheel={handleWheel}
      >
        <Layer>
          <Shapes onDragEnd={handleShapeDragEnd} shapes={shapes} tool={tool} />
        </Layer>
        <Layer>
          {selectedArea.visible && <Rect {...selectedArea} opacity={0.3} fill="aqua" stroke="blue" strokeWidth={1} />}
        </Layer>
        <Layer ref={previewLayerRef}></Layer>
      </Stage>
    </main>
  );
}

export default App;
