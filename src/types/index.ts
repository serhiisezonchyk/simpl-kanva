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
}
export interface Rectangle extends CommonShape, Size {
  type: ShapeType.RECTANGLE;
}
export interface Circle extends CommonShape, Size {
  type: ShapeType.CIRCLE;
  radiusX: number;
  radiusY: number;
}
export interface Text extends CommonShape {
  type: ShapeType.TEXT;
  text: string;
}
export interface Line extends CommonShape {
  type: ShapeType.LINE;
  points: number[];
}
export type Shape = Rectangle | Circle | Text | Line;
