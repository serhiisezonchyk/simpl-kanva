import { useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import Toolbar from './components/Toolbar';
import { useMouthArea } from './hooks/useMouseArea';
import { useStageScale } from './hooks/useStageScale';
import { useTool } from './hooks/useTool';
import { Shape, Tool } from './types';

function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const { tool, setTool } = useTool();
  const { handleWheel, stagePos, stageScale } = useStageScale();
  const { ...handlers } = useMouthArea({ tool });
  return (
    <main className="relative w-full">
      <Toolbar activeTool={tool} onChange={setTool} />
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
          <Rect x={20} y={20} width={100} height={100} fill="red" draggable />
        </Layer>
      </Stage>
    </main>
  );
}

export default App;
