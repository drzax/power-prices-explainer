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

export function regularPolygonVertices(sides, radius) {
  return Array.from({ length: sides }, (_, i) => {
    return {
      x: radius * Math.cos((2 * Math.PI * i) / sides),
      y: radius * Math.sin((2 * Math.PI * i) / sides)
    };
  });
}
