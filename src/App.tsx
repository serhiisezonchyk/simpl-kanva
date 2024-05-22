import { Layer, Rect, Stage } from 'react-konva';
import Toolbar from './components/Toolbar';
import { useTool } from './hooks/useTool';

function App() {
  const {tool,setTool} = useTool();
  return (
    <main className="relative w-full">
      <Toolbar activeTool={tool} onChange={setTool}/>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect x={20} y={20} width={100} height={100} fill='red' draggable/>
        </Layer>
      </Stage>
    </main>
  );
}

export default App;
