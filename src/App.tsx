import { KonvaEventObject } from 'konva/lib/Node';
import { useMemo, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import ShapeOptions from './components/ShapeOptions';
import Shapes from './components/Shapes';
import Toolbar from './components/Toolbar';
import { useMouthArea } from './hooks/useMouseArea';
import { useStageScale } from './hooks/useStageScale';
import { useTool } from './hooks/useTool';
import { Shape, ShapeStyle, Tool } from './types';
import { SelectionBox, isShapeSelected } from './utils/isShapeSelected';

function App() {
  const [defaultStyle, setDefaultStyle] = useState<ShapeStyle>({
  fill: 'transparent',
    stroke: 'white',
    strokeWidth: 7,
    fontSize: 20,
    cornerRadius: 10,
  });
  const [shapes, setShapes] = useState<Shape[]>([]);
  const { tool, setTool } = useTool();
  const { handleWheel, stagePos, stageScale } = useStageScale();

  const appendShape = (shape: Shape) => {
    setShapes((prev) => [...prev, shape]);
  };
  const selectShape = (id: string) => {
    setShapes((prev) => {
      return prev.map((shape) => {
        return { ...shape, selected: shape.id === id };
      });
    });
  };
  const selectShapesInArea = (selectionBox: SelectionBox) => {
    setShapes((prev) => prev.map((shape) => ({ ...shape, selected: isShapeSelected(shape, selectionBox) })));
  };
  const { previewLayerRef, selectedArea, ...handlers } = useMouthArea({
    tool,
    appendShape,
    selectShape,
    selectShapesInArea,
    style:defaultStyle
  });
  const handleShapeDragEnd = (e: KonvaEventObject<MouseEvent>) => {
    const shapeId = e.target.attrs.id;
    setShapes((prev) =>
      prev.map((shape) => (shape.id === shapeId ? { ...shape, x: e.target.x(), y: e.target.y() } : shape)),
    );
  };
  const activeShapes = useMemo(() => shapes.filter((s) => s.selected), [shapes]);
  return (
    <main className="relative w-full">
      <Toolbar activeTool={tool} onChange={setTool} />
      <ShapeOptions
        style={defaultStyle}
        deleteShapes={() => setShapes((p) => p.filter((shape) => !shape.selected))}
        onApplyStyles={(style) => {
          setDefaultStyle((p) => ({ ...p, ...style }));
          setShapes((p) => p.map((shape) => (shape.selected ? { ...shape, ...style } : shape)));
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
