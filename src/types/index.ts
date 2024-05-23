export enum ShapeType {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  TEXT = 'TEXT',
  LINE = 'LINE',
}
export enum Tool {
  POINTER = 'POINTER',
  GRAB = 'GRAB',
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  TEXT = 'TEXT',
  PENCIL = 'PENCIL',
}

//Editing
export interface ShapeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  fontSize: number;
  cornerRadius: number;
  text?: string;
}

export interface CommonStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
}
export interface Placement {
  x: number;
  y: number;
}
export interface Size {
  width: number;
  height: number;
}
export interface CommonShape extends Placement {
  id: string;
  selected?: boolean;
  type: ShapeType;
  cornerRadius?: number;
  text?: string;
  fontSize?: number;
}
export interface Rectangle extends CommonShape, Size, CommonStyle {
  type: ShapeType.RECTANGLE;
}
export interface Circle extends CommonShape, Size, CommonStyle {
  type: ShapeType.CIRCLE;
  radiusX: number;
  radiusY: number;
}
export interface Text extends CommonShape, CommonStyle {
  type: ShapeType.TEXT;
  text: string;
  fontSize: number;
}
export interface Line extends CommonShape, CommonStyle {
  type: ShapeType.LINE;
  points: number[];
}
export type Shape = Rectangle | Circle | Text | Line;
