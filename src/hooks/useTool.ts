import { useEffect, useState } from 'react';
import { Tool } from '../types';

export const useTool = () => {
  const [tool, setTool] = useState<Tool>(Tool.POINTER);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputActive =
        activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');

      if (!isInputActive)
        switch (e.key) {
          case '1':
            setTool(Tool.POINTER);
            break;
          case '2':
            setTool(Tool.GRAB);
            break;
          case '3':
            setTool(Tool.RECTANGLE);
            break;
          case '4':
            setTool(Tool.CIRCLE);
            break;
          case '5':
            setTool(Tool.TEXT);
            break;
          case '6':
            setTool(Tool.PENCIL);
            break;
        }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);
  return { tool, setTool };
};
