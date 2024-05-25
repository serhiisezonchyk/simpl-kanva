import { Trash2 } from 'lucide-react';
import { FC, useMemo } from 'react';
import { Shape, ShapeStyle, ShapeType, Text } from '../types';
import { aFromRgba, hexToRgba, rgbaStringToComponents, rgbaToHex } from '../utils/color';
import ToolbarButton from './ToolbarButton';

interface ShapeOptionsProps {
  style: ShapeStyle;
  onApplyStyles: (styles: Partial<ShapeStyle>) => void;
  activeShapes: Shape[];
  deleteShapes: () => void;
}

const colorOptions: {
  title: string;
  key: keyof ShapeStyle;
  type: 'color';
}[] = [
  {
    title: 'Background',
    key: 'fill',
    type: 'color',
  },
  {
    title: 'Stroke',
    key: 'stroke',
    type: 'color',
  },
];

//strokeWidth
const ShapeOptions: FC<ShapeOptionsProps> = ({ onApplyStyles, activeShapes, style, deleteShapes }) => {
  const textShape = useMemo(
    () => activeShapes.find((shape) => shape.type === ShapeType.TEXT) as Text | undefined,
    [activeShapes],
  );

  const handleColorChange = (key: keyof ShapeStyle, color: string) => {
    const rgbaColor = hexToRgba(color, '1');
    onApplyStyles({ [key]: rgbaColor });
  };

  const handleAlphaChange = (key: keyof ShapeStyle, alpha: string) => {
    const currentColor = style[key];
    const components = rgbaStringToComponents(currentColor as string);
    if (components) {
      const { r, g, b } = components;
      const rgbaColor = `rgba(${r},${g},${b},${alpha})`;
      onApplyStyles({ [key]: rgbaColor });
    }
  };

  const handleRangeChane = (key: keyof ShapeStyle, value: number) => {
    onApplyStyles({ [key]: value });
  };

  const currentFigureOption = useMemo(() => (activeShapes[0] ? activeShapes[0] : style), [activeShapes[0]]);
  return (
    <menu className="absolute left-5 top-24 z-20 flex w-fit flex-col items-center gap-1 rounded-lg bg-gray-800 p-4">
      {activeShapes.length < 2 && (
        <>
          <div className="flex w-full flex-col gap-5">
            {colorOptions.map((option) => (
              <div key={option.title} className="flex flex-col items-start text-white">
                <b>{option.title}</b>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="circle-color-picker flex-1"
                    value={rgbaToHex(currentFigureOption[option.key] as string)}
                    onChange={(e) => handleColorChange(option.key, e.target.value)}
                  />
                  <input
                    type="number"
                    id="alpha"
                    min="0"
                    max="1"
                    step="0.05"
                    value={aFromRgba(currentFigureOption[option.key] as string)}
                    className="flex-2 h-8 rounded border border-gray-300 p-2 text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      handleAlphaChange(option.key, e.target.value);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <b className="mt-4 w-full text-start text-white">Stroke width</b>
          <input
            className="mt-2 w-full rounded"
            value={currentFigureOption.strokeWidth}
            onChange={(e) => {
              handleRangeChane('strokeWidth' , +e.target.value);
            }}
            type="range"
            min={1}
            max={5}
            step={1}
          />
          {textShape && (
            <>
              <b className="mt-4 w-full text-start text-white">Text</b>
              <input
                className="mt-2 w-full rounded p-2"
                value={textShape.text}
                onChange={(e) => onApplyStyles({ text: e.target.value })}
              />
              <b className="mt-4 w-full text-start text-white">Font size</b>
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
          <div className="mt-6"></div>
        </>
      )}

      {activeShapes.length > 0 && (
        <ToolbarButton
          onClick={deleteShapes}
          className="mr-auto bg-red-100 text-red-600 hover:bg-red-600 hover:text-red-100"
        >
          <Trash2 />
        </ToolbarButton>
      )}
    </menu>
  );
};

export default ShapeOptions;
