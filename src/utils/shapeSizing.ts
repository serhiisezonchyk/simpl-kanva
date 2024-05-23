import { Placement } from '../types';
import { Size } from './../types/index';

export const shapeSizing = {
  getRectSize: ({ height, width }: Size, { x, y }: Placement) => ({
    width,
    height,
    x: x - width / 2,
    y: y - height / 2,
  }),
  getCircleSize: ({ height, width }: Size, { x, y }: Placement) => ({
    radiusX: width / 2,
    radiusY: height / 2,
    x,
    y,
  }),
};
