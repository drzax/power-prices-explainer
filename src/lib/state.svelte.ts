import { barycentric } from 'd3-ternary';
import { defaultVisConfig, plotMargins } from './constants';
import { getPolygonPositionAndSize } from './trig';

export const visState = $state({
  dimensions: { width: 100, height: 100, axisLength: 0 },
  scale: barycentric(),
  config: defaultVisConfig
});

export const ternaryToCartesian = (values: [number, number, number]) => {
  const [x, y] = visState.scale(values);
  let width = visState.dimensions.width - plotMargins.left - plotMargins.right;
  let height = visState.dimensions.height - plotMargins.top - plotMargins.bottom;

  const { radius, center } = getPolygonPositionAndSize(width, height, 30, 3);
  return {
    x: x * (radius - 5) + center.x + plotMargins.left,
    y: y * (radius - 5) + center.y + plotMargins.top
  };
};
