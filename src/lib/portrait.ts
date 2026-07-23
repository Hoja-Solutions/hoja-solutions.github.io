// Deterministic constellation "portrait" generated from a post's content.
// Shared by the blog post page (inline SVG header) and the Open Graph image
// endpoint, so the social preview matches the illustration on the page.

export type PortraitPoint = { x: number; y: number; color: string };
export type PortraitLine = { a: number; b: number; color: string; opacity: number };
export type Portrait = { points: PortraitPoint[]; lines: PortraitLine[] };

const COLORS = ["#6bb82d", "#4d9622", "#b5ada0", "#908779", "#8fd042"];

// Coordinates are in a 0-100 space on both axes so the same data renders into
// any container shape (a wide page banner or a 1200x630 preview card).
export function generatePortrait(content: string): Portrait {
  const hash = content.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  let s = Math.abs(hash);
  const next = () => {
    s = (s * 16807 + 11) % 2147483647;
    return s / 2147483647;
  };
  const rand = (min: number, max: number) => min + next() * (max - min);

  const cols = 12 + Math.floor(rand(0, 5));
  const rows = 4 + Math.floor(rand(0, 2));
  const cellW = 100 / cols;
  const cellH = 100 / rows;

  const points: PortraitPoint[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const jx = rand(-cellW * 0.4, cellW * 0.4);
      const jy = rand(-cellH * 0.4, cellH * 0.4);
      const x = Math.max(2, Math.min(98, cellW * (col + 0.5) + jx));
      const y = Math.max(2, Math.min(98, cellH * (row + 0.5) + jy));
      points.push({ x, y, color: COLORS[Math.floor(rand(0, COLORS.length))] });
    }
  }

  const lines: PortraitLine[] = [];
  points.forEach((p, i) => {
    const dists = points.map((q, j) => ({
      j,
      d: Math.sqrt((p.x - q.x) ** 2 + (p.y - q.y) ** 2),
    }));
    dists.sort((a, b) => a.d - b.d);
    const numConn = 2 + Math.floor(rand(0, 2));
    for (let k = 0; k < Math.min(numConn, dists.length - 1); k++) {
      if (dists[k].j > i) {
        lines.push({
          a: i,
          b: dists[k].j,
          color: COLORS[Math.floor(rand(0, COLORS.length))],
          opacity: rand(0.1, 0.35),
        });
      }
    }
  });

  return { points, lines };
}

// A standalone SVG string sized in pixels, for rasterizing to a preview image.
// No text, so it needs no fonts installed on the build machine.
export function portraitSVG(content: string, width = 1200, height = 630): string {
  const { points, lines } = generatePortrait(content);
  const px = (v: number) => ((v / 100) * width).toFixed(2);
  const py = (v: number) => ((v / 100) * height).toFixed(2);

  const lineEls = lines
    .map((l) => {
      const a = points[l.a];
      const b = points[l.b];
      return `<line x1="${px(a.x)}" y1="${py(a.y)}" x2="${px(b.x)}" y2="${py(b.y)}" stroke="${l.color}" stroke-width="1.5" stroke-opacity="${l.opacity.toFixed(3)}"/>`;
    })
    .join("");

  const dotEls = points
    .map((p) => `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="5" fill="${p.color}"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f2edd9"/>${lineEls}${dotEls}</svg>`;
}
