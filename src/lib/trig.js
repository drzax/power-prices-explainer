// @ts-check

/**
 * Calculate a collection of arcs that round the corners of a polygon
 * @param {{x: number; y:number}[]} vertices
 * @param {number} radius
 */
export function calculateRoundedCorners(vertices, radius) {
  const arcs = [];
  const numVertices = vertices.length;

  for (let i = 0; i < numVertices; i++) {
    const prev = vertices[(i - 1 + numVertices) % numVertices];
    const curr = vertices[i];
    const next = vertices[(i + 1) % numVertices];

    const v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };

    const v1Length = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const v2Length = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    const unitV1 = { x: v1.x / v1Length, y: v1.y / v1Length };
    const unitV2 = { x: v2.x / v2Length, y: v2.y / v2Length };

    const dotProduct = unitV1.x * unitV2.x + unitV1.y * unitV2.y;
    const angle = Math.acos(dotProduct);
    const tangentLength = radius / Math.tan(angle / 2);

    const start = {
      x: curr.x + unitV1.x * tangentLength,
      y: curr.y + unitV1.y * tangentLength
    };

    const end = {
      x: curr.x + unitV2.x * tangentLength,
      y: curr.y + unitV2.y * tangentLength
    };

    const bisector = { x: unitV1.x + unitV2.x, y: unitV1.y + unitV2.y };
    const bisectorLength = Math.sqrt(bisector.x * bisector.x + bisector.y * bisector.y);
    const unitBisector = { x: bisector.x / bisectorLength, y: bisector.y / bisectorLength };

    const arcCenter = {
      x: curr.x + unitBisector.x * (radius / Math.sin(angle / 2)),
      y: curr.y + unitBisector.y * (radius / Math.sin(angle / 2))
    };

    arcs.push({ center: arcCenter, arcStart: start, arcEnd: end, radius });
  }
  return arcs;
}

/**
 * Get polygons for each of the segments of a regular polygon divided midway between each vertex
 * @param {{x:number; y:number}[]} vertices
 */
export function getSegmentPolygons(vertices) {
  const numVertices = vertices.length;
  const center = vertices.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }), { x: 0, y: 0 });
  center.x /= numVertices;
  center.y /= numVertices;

  const midpoints = [];
  for (let i = 0; i < numVertices; i++) {
    const curr = vertices[i];
    const next = vertices[(i + 1) % numVertices];
    midpoints.push({
      x: (curr.x + next.x) / 2,
      y: (curr.y + next.y) / 2
    });
  }

  const segments = [];
  for (let i = 0; i < numVertices; i++) {
    const mid1 = midpoints[i];
    const mid2 = midpoints[(i + 1) % numVertices];
    const vertex = vertices[(i + 1) % numVertices];
    segments.push([center, mid1, vertex, mid2]);
  }

  return segments;
}

/**
 * Calculate a set of vertices that describe a regular polygon with a given number of sides and radius
 * @param {number} sides
 * @param {number} radius
 */
export function regularPolygonVertices(sides, radius) {
  return Array.from({ length: sides }, (_, i) => {
    return {
      x: radius * Math.cos((2 * Math.PI * i) / sides),
      y: radius * Math.sin((2 * Math.PI * i) / sides)
    };
  });
}

/**
 * Convert an angle in degrees to radians
 * @param {number} deg an angle in degrees
 */
const deg2rad = deg => (deg * Math.PI) / 180;

/**
 * Return a path string to draw an arrow described by the parameters passed.
 * @param {number} length
 * @param {number} lineWidth The width of the arrow's lines
 * @param {number} headAngle An angle (in degress)  that determines the width of the arrow's head
 * @param {number} headLength The length of each stroke of the arrow's head
 * @param {number} rounding The amount of rounding to apply to the ends of the lines of the arrow [0-1]
 * @param {number} px The x-coordinate of the arrow's point
 * @param {number} py  The y-coordinate of the arrow's point
 */
export function generateArrowPath(length, lineWidth, headAngle, headLength, rounding = 0, px = 0, py = 0) {
  console.log('length, lineWidth, headAngle, headLength :>> ', length, lineWidth, headAngle, headLength);

  const halfLineWidth = lineWidth / 2;

  let current = { x: 0, y: 0, prefix: 'M' };

  // Origin is the point of the arrow
  const vertices = [current];

  vertices.push(
    (current = {
      x: Math.cos(deg2rad(headAngle)) * headLength,
      y: Math.sin(deg2rad(headAngle)) * headLength,
      prefix: 'L'
    })
  );

  vertices.push(
    (current = {
      x: current.x + Math.cos(deg2rad(headAngle - 90)) * lineWidth,
      y: current.y + Math.sin(deg2rad(headAngle - 90)) * lineWidth,
      prefix: `A ${halfLineWidth * rounding} ${halfLineWidth * rounding} 0 0 0 `
    })
  );

  vertices.push(
    (current = {
      x: current.x + (halfLineWidth - current.y) / Math.tan(deg2rad(headAngle - 180)),
      y: halfLineWidth,
      prefix: 'L'
    })
  );

  vertices.push(
    (current = {
      x: length,
      y: halfLineWidth,
      prefix: 'L'
    })
  );

  vertices.push(
    (current = {
      x: length,
      y: -halfLineWidth,
      prefix: `A ${halfLineWidth * rounding} ${halfLineWidth * rounding} 0 0 0 `
    })
  );

  vertices.push(
    (current = {
      x: vertices[vertices.length - 3].x,
      y: -halfLineWidth,
      prefix: 'L'
    })
  );

  vertices.push(
    (current = {
      x: vertices[vertices.length - 5].x,
      y: -vertices[vertices.length - 5].y,
      prefix: 'L'
    })
  );

  vertices.push(
    (current = {
      x: vertices[vertices.length - 7].x,
      y: -vertices[vertices.length - 7].y,
      prefix: `A ${halfLineWidth * rounding} ${halfLineWidth * rounding} 0 0 0 `
    })
  );

  return `${vertices.map(({ prefix, x, y }) => `${prefix} ${x + px} ${y + py}`).join('')} Z`;
}

/**
 * The cartesian distance between two points
 * @param {{x:number; y:number}} a Point a
 * @param {{x:number; y:number}} b Point b
 */
export const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

/**
 *
 * @param {{x:number, y:number; r: number}} c1
 * @param {{x:number, y:number; r: number}} c2
 * @returns {string}
 */
export function arcPathBetweenCircles(c1, c2) {
  // Distance between circle centers
  const d = distance(c1, c2);

  const offset = d / 3;

  // Unit vector between circle centers
  const v1 = { x: (c1.x - c2.x) / d, y: (c1.y - c2.y) / d };

  // Perpendicular unit vector
  const v2 = { x: v1.y, y: -v1.x };

  // TODO: modify direction of perpendicular vector depending on position of c1 and c2
  if ((c1.x > c2.x && c1.y < c2.y) || (c1.x < c2.x && c1.y > c2.y)) {
    v2.x = -v2.x;
    v2.y = -v2.y;
  }

  // Points on circumference of circles along unit vector
  const c1p = { x: c1.x - v1.x * c1.r, y: c1.y - v1.y * c1.r };
  const c2p = { x: c2.x + v1.x * c2.r, y: c2.y + v1.y * c2.r };

  // Midpoint between circumference points
  const mp = { x: (c1p.x + c2p.x) / 2, y: (c1p.y + c2p.y) / 2 };

  const mo = { x: mp.x + v2.x * -offset, y: mp.y + v2.y * -offset };
  const hyp1 = distance(mo, c1);
  const hyp2 = distance(mo, c2);

  const a1v = { x: (c1.x - mo.x) / hyp1, y: (c1.y - mo.y) / hyp1 };
  const a2v = { x: (c2.x - mo.x) / hyp2, y: (c2.y - mo.y) / hyp2 };

  const a1 = { x: c1.x - a1v.x * c1.r, y: c1.y - a1v.y * c1.r };
  const a2 = { x: c2.x - a2v.x * c2.r, y: c2.y - a2v.y * c2.r };

  return `M${a1.x} ${a1.y}S${mo.x} ${mo.y} ${a2.x} ${a2.y}`;
}

/**
 * Rotate a single point around an origin by a given angle
 * @param {{x:number; y:number}} point
 * @param {number} angle
 * @param {{x:number; y: number}} origin
 * @returns {{x:number; y:number}}
 */
export function rotate(point, angle, origin = { x: 0, y: 0 }) {
  const radians = (Math.PI / 180) * angle;
  const cosTheta = Math.cos(radians);
  const sinTheta = Math.sin(radians);

  const translatedX = point.x - origin.x;
  const translatedY = point.y - origin.y;

  const rotatedX = translatedX * cosTheta - translatedY * sinTheta;
  const rotatedY = translatedX * sinTheta + translatedY * cosTheta;

  return {
    x: rotatedX + origin.x,
    y: rotatedY + origin.y
  };
}

/**
 * Translate a single point
 * @param {{x:number; y:number}} point
 * @param {{x:number; y:number}} translation
 * @returns {{x:number; y:number}}
 */
export function translate(point, translation) {
  return {
    x: point.x + translation.x,
    y: point.y + translation.y
  };
}

/**
 *
 * @param {number} w The width of the containing box
 * @param {number} h The height of the containing box
 * @param {number} rotation The rotation of the polygon in degrees
 * @param {number} sides Number of sides of the polygon
 * @returns {{radius: number; center: {x:number; y:number}}}
 */
export function getPolygonPositionAndSize(w, h, rotation, sides) {
  const vertices = regularPolygonVertices(sides, 1).map(d => rotate(d, rotation));

  // The bounding box of the rotated unit polygon
  const extents = vertices.reduce(
    ({ minX, minY, maxX, maxY }, { x, y }) => {
      return { minX: Math.min(x, minX), minY: Math.min(y, minY), maxX: Math.max(x, maxX), maxY: Math.max(y, maxY) };
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  // The width and height of the unit polygon
  const width = extents.maxX - extents.minX;
  const height = extents.maxY - extents.minY;

  // Scale
  const scale = Math.min(w / width, h / height);

  // Compute the largest radius that fits
  const radius = scale;

  // Compute the polygon's center in unit space
  const unitCenter = {
    x: (extents.minX + extents.maxX) / 2,
    y: (extents.minY + extents.maxY) / 2
  };

  // Compute the center of the polygon within the rectangle
  const center = {
    x: w / 2 - unitCenter.x * scale,
    y: h / 2 - unitCenter.y * scale
  };

  return { radius, center };
}
