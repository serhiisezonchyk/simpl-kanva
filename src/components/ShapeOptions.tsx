import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import { Shape, ShapeStyle, ShapeType, Text } from '../types';
import ToolbarButton from './ToolbarButton';

interface ShapeOptionsProps {
  style: ShapeStyle;
  onApplyStyles: (styles: Partial<ShapeStyle>) => void;
  activeShapes: Shape[];
  deleteShapes: () => void;
}

const strokeColors = ['white', 'red', 'black', 'blue'];
const backgroundColors = [...strokeColors, 'transparent'];
const cornerRadius = [0, 5, 10];

const ShapeOptions: FC<ShapeOptionsProps> = ({ onApplyStyles, activeShapes, style, deleteShapes }) => {
  const textShape = activeShapes.find((shape) => shape.type === ShapeType.TEXT) as Text | undefined;

  const options: {
    title: string;
    options: ShapeStyle[keyof ShapeStyle][];
    key: keyof ShapeStyle;
    type: 'color' | 'text';
  }[] = [
    {
      title: 'Background',
      options: backgroundColors,
      key: 'fill',
      type: 'color',
    },
    {
      title: 'Stroke',
      options: strokeColors,
      key: 'stroke',
      type: 'color',
    },
    {
      title: 'Corner radius',
      options: cornerRadius,
      key: 'cornerRadius',
      type: 'text',
    },
  ];

  return (
    <menu className="absolute left-5 top-24 z-20 flex w-fit flex-col items-center gap-1 rounded-lg bg-gray-800 p-4">
      <div className="flex flex-col gap-5">
        {options.map((option) => (
          <div key={option.title} className="flex flex-col items-start text-white">
            <b>{option.title}</b>
            <div className="flex gap-1">
              {option.options.map((opt) => {
                return (
                  <ToolbarButton
                    active={style[option.key] === opt}
                    onClick={() => onApplyStyles({ [option.key]: opt })}
                    key={opt}
                    className={option.type === 'color' ? 'w-fit p-2' : ''}
                  >
                    {option.type === 'color' ? (
                      opt === 'transparent' ? (
                        <div
                          style={{ backgroundColor: opt as string }}
                          className="h-7 w-7 rounded border border-gray-100"
                        >
                          x
                        </div>
                      ) : (
                        <div style={{ backgroundColor: opt as string }} className="border-3 h-7 w-7 rounded " />
                      )
                    ) : (
                      opt
                    )}
                  </ToolbarButton>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {textShape && (
        <>
          <b className="mt-4 w-full text-start">Text</b>
          <input
            className="mt-2 w-full rounded p-2"
            value={textShape.text}
            onChange={(e) => onApplyStyles({ text: e.target.value })}
          />
          <b className="mt-4 w-full text-start">Font size</b>
          <input
            type="number"
            value={textShape.fontSize}
            onChange={(e) => onApplyStyles({ fontSize: Number(e.target.value) })}
            className="mt-2 w-full rounded p-2"
            max={100}
            min={0}
            step={5}
          />
        </>
      )}

      {activeShapes.length > 0 && (
        <ToolbarButton
          onClick={deleteShapes}
          className="mr-auto mt-6 bg-red-100 text-red-600 hover:bg-red-600 hover:text-red-100"
        >
          <Trash2 />
        </ToolbarButton>
      )}
    </menu>
  );
};

export default ShapeOptions;
