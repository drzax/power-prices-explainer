import { barycentric } from 'd3-ternary';

export const plot = $state({ width: 100, height: 100 });
export const scale = barycentric();
