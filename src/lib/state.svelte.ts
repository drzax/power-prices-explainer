import { barycentric } from 'd3-ternary';
import { defaultVisConfig } from './constants';

export const visState = $state({
  dimensions: { width: 100, height: 100, axisLength: 0 },
  scale: barycentric(),
  config: defaultVisConfig
});

export const ternaryToCartesian = (values: [number, number, number]) => {
  const [x, y] = visState.scale(values);
  const radius = Math.min(visState.dimensions.width, visState.dimensions.height) / 2 - 5;
  return {
    x: x * radius + visState.dimensions.width / 2,
    y: y * radius + visState.dimensions.height / 2
  };
};
