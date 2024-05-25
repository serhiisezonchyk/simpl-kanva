import { Circle, Grab, Pencil, Pointer, RectangleHorizontal, TextCursor } from 'lucide-react';
import React from 'react';
import { Tool } from '../types';
import ToolbarButton from './ToolbarButton';
interface ToolbarProps {
  activeTool: Tool;
  onChange: (tool: Tool) => void;
}
const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onChange }) => {
  const tools = [
    { id: Tool.POINTER, IconTool: Pointer },
    { id: Tool.GRAB, IconTool: Grab },
    { id: Tool.RECTANGLE, IconTool: RectangleHorizontal },
    { id: Tool.CIRCLE, IconTool: Circle },
    { id: Tool.TEXT, IconTool: TextCursor },
    { id: Tool.PENCIL, IconTool: Pencil },
  ];
  return (
    <div className="bg md-4 absolute z-20 justify-around flex w-full items-center bg-gray-800 p-2 md:left-1/2 md:top-5 md:w-fit md:-translate-x-1/2 md:gap-10 md:rounded-lg">
      {tools.map(({ id, IconTool }, i) => {
        return (
          <ToolbarButton onClick={() => onChange(id)} active={id === activeTool} key={id}>
            <IconTool />
            <span className="absolute bottom-0 right-1 text-xs">{i + 1}</span>
          </ToolbarButton>
        );
      })}
    </div>
  );
};

export default Toolbar;
