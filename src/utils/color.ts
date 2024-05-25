export const hexToRgba = (hex: string, alpha: string) => {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r},${g},${b},${alpha})`;
  };

export const rgbaStringToComponents = (rgba: string) => {
  const result = rgba.match(/rgba?\((\d+),(\d+),(\d+),(\d+\.?\d*)\)/);
  if (result) {
    return {
      r: parseInt(result[1], 10),
      g: parseInt(result[2], 10),
      b: parseInt(result[3], 10),
      a: parseFloat(result[4]),
    };
  }
  return null;
};

export const rgbaToHex = (rgba: string) => {
  const components = rgbaStringToComponents(rgba);
  if (components) {
    const { r, g, b } = components;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }
  return '#000000';
};
export const aFromRgba = (rgba: string) => {
  const data = rgbaStringToComponents(rgba);
  return data?.a;
};
