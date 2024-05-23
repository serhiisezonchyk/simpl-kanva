import { KonvaEventObject } from 'konva/lib/Node';
import { Ellipse, Line, Rect, Text } from 'react-konva';
import { Shape, ShapeType, Tool } from '../types';

interface ShapesProps {
  shapes: Shape[];
  tool: Tool;
  onDragEnd: (e: KonvaEventObject<MouseEvent>) => void;
}
const Shapes: React.FC<ShapesProps> = ({ shapes, tool, onDragEnd }) => {
  const commonOptions = {
    draggable: tool === Tool.POINTER,
    onDragEnd,
  };
  return shapes.map((shape) => {
    const activeProps = shape.selected
      ? {
          shadowColor: 'blue',
          shadowBlur: 15,
          shadowOpacity: 100,
        }
      : {};
    const shapeProps = { ...commonOptions, ...shape, ...activeProps };
    switch (shape.type) {
      case ShapeType.RECTANGLE:
        return <Rect key={shape.id} {...shapeProps} />;
      case ShapeType.CIRCLE:
        return (
          <Ellipse
            key={shape.id}
            {...commonOptions}
            {...shape}
            {...shapeProps}
            height={shape.radiusY * 2}
            width={shape.radiusX * 2}
          />
        );
      case ShapeType.TEXT:
        return <Text key={shape.id} {...commonOptions} {...shape} {...shapeProps} />;
      case ShapeType.LINE:
        return <Line key={shape.id} {...commonOptions} {...shape} {...shapeProps} x={0} y={0} />;
    }
  });
};

export default Shapes;
