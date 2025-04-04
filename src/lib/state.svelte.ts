import { barycentric } from 'd3-ternary';
import { defaultVisConfig } from './constants';
import { getPolygonPositionAndSize } from './trig';

export const visState = $state({
  dimensions: { width: 100, height: 100, axisLength: 0 },
  scale: barycentric(),
  config: defaultVisConfig
});

export const ternaryToCartesian = (values: [number, number, number]) => {
  const [x, y] = visState.scale(values);
  const { radius, center } = getPolygonPositionAndSize(visState.dimensions.width, visState.dimensions.height, 30, 3);
  return {
    x: x * (radius - 5) + center.x,
    y: y * (radius - 5) + center.y
  };
};
