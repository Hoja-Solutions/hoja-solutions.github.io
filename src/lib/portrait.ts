// Semantic constellation "portrait" generated from a post's content.
// Each node is a meaningful word from the text. Nodes are positioned by
// hashing the word itself, so the same concept always occupies the same
// spot across all portraits — creating a shared semantic space. Edges
// connect words that co-occur in the text. Force-directed layout pulls
// related concepts together, revealing the topic structure of the post.
//
// Shared by the blog post page (inline SVG header), the blog list
// thumbnails, and the Open Graph image endpoint.

export type PortraitPoint = {
  x: number;
  y: number;
  color: string;
  /** Normalized radius 0.3–1.0 driven by word frequency. */
  radius: number;
};

export type PortraitLine = {
  a: number;
  b: number;
  color: string;
  opacity: number;
  /** Normalized stroke-width driven by co-occurrence strength. */
  width: number;
};

export type Portrait = {
  points: PortraitPoint[];
  lines: PortraitLine[];
};

const STOP_WORDS = new Set([
  // English
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need",
  "it", "its", "this", "that", "these", "those",
  "i", "you", "he", "she", "we", "they", "me", "him", "her", "us", "them",
  "my", "your", "his", "our", "their",
  "what", "which", "who", "whom", "when", "where", "why", "how",
  "all", "each", "every", "both", "few", "more", "most", "other", "some",
  "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too",
  "very", "just", "about", "up", "out", "if", "then", "also",
  "into", "through", "during", "before", "after", "above", "below",
  "between", "under", "again", "further", "once", "here", "there", "any",
  "because", "as", "until", "while", "after", "since", "over", "down",
  "new", "one", "two", "first", "back", "even", "well", "still", "make",
  "made", "make", "many", "time", "way", "use", "used", "using", "like",
  "get", "got", "going", "go", "come", "take", "good", "much",
  // Spanish
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al",
  "en", "con", "por", "para", "sin", "sobre", "entre", "hacia", "segun",
  "como", "que", "cuando", "donde", "mientras", "aunque", "si", "pero",
  "sino", "o", "ni", "y", "es", "son", "era", "eran", "fue", "fueron",
  "ser", "estar", "esta", "estan", "este", "estos", "estas",
  "ese", "esa", "esos", "esas", "aquel", "aquella",
  "yo", "tu", "ella", "nosotros", "vosotros", "ellos", "ellas",
  "me", "te", "se", "nos", "lo", "la", "le", "les", "nos",
  "mi", "tu", "su", "nuestro", "vuestro",
  "cual", "cuales", "cuanto", "cuya", "cuyos", "cuyo", "cuyas",
  "mas", "menos", "muy", "tan", "tanto", "solo", "mismo", "misma",
  "otro", "otra", "otros", "otras", "todo", "toda", "todos", "todas",
  "cada", "algo", "nada", "alguien", "nadie", "hay", "hace", "hacer",
  "puede", "pueden", "poco", "pocas", "mas", "ya", "ahi", "aun",
  "sin", "sobre", "hasta", "según", "aún", "más", "también", "mismo",
  // Spanish forms that keep their accent after the text is normalised, so the
  // unaccented spellings above never match them.
  "qué", "quién", "cómo", "dónde", "cuándo", "cuál", "así", "está", "están",
  "sus", "dentro", "detrás", "desde", "luego", "esto", "eso", "él",
  // Weak verbs and adverbs that survive frequency filtering without saying
  // anything about a post's subject.
  "see", "seen", "say", "says", "said", "put", "came", "per", "let", "lets",
  "yet", "via", "onto", "within", "without", "upon", "behind", "around",
  "already", "instead", "actually", "really", "enough", "often", "always",
  "never", "thing", "things",
  // Common tech filler
  "based", "build", "building", "builds",
]);

function hsl(c: { hue: number; sat: number; lit: number }): string {
  return `hsl(${c.hue.toFixed(0)},${c.sat.toFixed(0)}%,${c.lit.toFixed(0)}%)`;
}

function hashStr(s: string): number {
  let h = 0x8261b5ae >>> 0;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 1307654547);
  // The multiply chain alone leaves the last character barely mixed, so two
  // strings differing only in their final byte hash to values a fixed distance
  // apart. Callers here lean on short salts that differ by very little, such as
  // the "row" and "col" passed alongside the same word, and correlated results
  // would put every term on a diagonal instead of spreading them out.
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

function hashContent(content: string): number {
  let h1 = 0xdeadbeef >>> 0;
  let h2 = 0x41c6ce57 >>> 0;
  for (let i = 0; i < content.length; i++) {
    const ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  return (h1 >>> 0) ^ (h2 >>> 0);
}

function createRNG(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = ((z ^ (z >>> 16)) * 0x45d9f3b) >>> 0;
    z = ((z ^ (z >>> 16)) * 0x45d9f3b) >>> 0;
    return ((z ^ (z >>> 16)) >>> 0) / 4294967296;
  };
}

/** Deterministic hue for a word (same word → same color everywhere). */
function wordHue(word: string): number {
  const h = hashStr(word + "\x00h");
  // Map into brand-friendly range: 25-120 (warm earth through green)
  return 25 + ((h >>> 0) / 4294967296) * 95;
}

// Merge obvious morphological variants so "model" and "models", or "agente"
// and "agentes", compete for one slot instead of two. Deliberately shallow:
// the aim is to stop near-duplicates crowding the portrait, not to analyse
// morphology properly.
const STEM_RULES: Array<[string, string]> = [
  ["ciones", "cion"],
  ["iones", "ion"],
  ["ing", ""],
  ["ies", "y"],
  ["ed", ""],
  ["s", ""],
];

function stem(word: string): string {
  if (word.length <= 4) return word;
  // A trailing double s, or "us"/"is", belongs to the word rather than marking
  // a plural: harness and analysis must not turn into harnes and analysi.
  if (/(?:ss|us|is)$/.test(word)) return word;
  // Spanish builds a plural with "-es" after a consonant (servidores, patrones),
  // whereas an English "-es" usually follows the stem's own s or e (releases,
  // closes). Take the whole "es" only when what remains ends in one of those
  // Spanish consonants; everything else falls through to dropping one "s".
  if (word.endsWith("es")) {
    const base = word.slice(0, -2);
    if (base.length >= 4 && /[rnldz]$/.test(base)) return base;
  }
  for (const [suffix, replacement] of STEM_RULES) {
    if (!word.endsWith(suffix)) continue;
    const base = word.slice(0, word.length - suffix.length) + replacement;
    if (base.length >= 4) return base;
  }
  return word;
}

interface Term {
  word: string;
  weight: number;
  firstAt: number;
}

interface TermEdge {
  a: string;
  b: string;
  pmi: number;
}

const WINDOW = 5;
const MAX_TERMS = 34;

function pairKey(a: string, b: string): string {
  return a < b ? a + "\x00" + b : b + "\x00" + a;
}

/**
 * Reduce markdown to the ideas it keeps returning to: TextRank over a
 * co-occurrence window decides which terms matter, positive PMI decides which
 * links between them are real.
 */
function extractTerms(
  content: string,
): { terms: Term[]; edges: TermEdge[] } | null {
  const text = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/#{1,6}\s*/g, " ")
    .replace(/[*_~]/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[^\wáéíóúñüÁÉÍÓÚÑÜ\s]/g, " ")
    .toLowerCase();

  const surface = text
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
  if (surface.length < 8) return null;

  const tokens = surface.map(stem);

  // A term has to appear at least twice to qualify, which drops the long tail
  // of words mentioned once in passing.
  const uniCount = new Map<string, number>();
  for (const t of tokens) uniCount.set(t, (uniCount.get(t) ?? 0) + 1);
  const biCount = new Map<string, number>();
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = tokens[i] + " " + tokens[i + 1];
    biCount.set(bg, (biCount.get(bg) ?? 0) + 1);
  }

  const candidates = new Set<string>();
  for (const [w, c] of uniCount) if (c >= 2) candidates.add(w);
  for (const [w, c] of biCount) if (c >= 2) candidates.add(w);
  if (candidates.size < 4) return null;

  // Walk the text as a sequence of terms, taking the longer match first so
  // "open source" counts as one idea. Matching single tokens only, as this
  // previously did, left every multiword term with no co-occurrences at all
  // and therefore no edges: they could only ever render as loose dots.
  const seq: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const bg = i + 1 < tokens.length ? tokens[i] + " " + tokens[i + 1] : "";
    if (bg && candidates.has(bg)) {
      seq.push(bg);
      i++;
    } else if (candidates.has(tokens[i])) {
      seq.push(tokens[i]);
    }
  }
  if (seq.length < 8) return null;

  const firstAt = new Map<string, number>();
  const count = new Map<string, number>();
  seq.forEach((w, i) => {
    if (!firstAt.has(w)) firstAt.set(w, i);
    count.set(w, (count.get(w) ?? 0) + 1);
  });

  const pairs = new Map<string, number>();
  for (let i = 0; i < seq.length; i++) {
    const stop = Math.min(seq.length, i + WINDOW + 1);
    for (let j = i + 1; j < stop; j++) {
      if (seq[i] === seq[j]) continue;
      const k = pairKey(seq[i], seq[j]);
      pairs.set(k, (pairs.get(k) ?? 0) + 1);
    }
  }
  if (pairs.size === 0) return null;

  const words = [...count.keys()];
  const index = new Map(words.map((w, i) => [w, i]));
  const neighbours: Array<Array<[number, number]>> = words.map(() => []);
  const linked = new Float64Array(words.length);
  for (const [k, c] of pairs) {
    const sep = k.indexOf("\x00");
    const ai = index.get(k.slice(0, sep))!;
    const bi = index.get(k.slice(sep + 1))!;
    neighbours[ai].push([bi, c]);
    neighbours[bi].push([ai, c]);
    linked[ai] += c;
    linked[bi] += c;
  }

  // TextRank. Important here means linked to other important terms, which
  // describes what a post is about better than raw counts do: a word repeated
  // inside a single aside scores below one threaded through the argument.
  const RANK_DAMPING = 0.85;
  let rank = new Float64Array(words.length).fill(1 / words.length);
  for (let iter = 0; iter < 30; iter++) {
    const next = new Float64Array(words.length).fill(
      (1 - RANK_DAMPING) / words.length,
    );
    for (let i = 0; i < words.length; i++) {
      if (linked[i] === 0) continue;
      const share = (RANK_DAMPING * rank[i]) / linked[i];
      for (const [j, w] of neighbours[i]) next[j] += share * w;
    }
    rank = next;
  }

  // A repeated phrase says more about a post than either of its halves, so it
  // takes a small bonus and its component words step aside.
  const ranked = words
    .map((w) => ({
      word: w,
      weight: rank[index.get(w)!] * (w.includes(" ") ? 1.35 : 1),
    }))
    .sort((a, b) => b.weight - a.weight);

  const insidePhrase = new Set<string>();
  const chosen: Array<{ word: string; weight: number }> = [];
  for (const r of ranked) {
    if (chosen.length >= MAX_TERMS) break;
    if (!r.word.includes(" ") && insidePhrase.has(r.word)) continue;
    chosen.push(r);
    if (r.word.includes(" ")) {
      for (const part of r.word.split(" ")) insidePhrase.add(part);
    }
  }
  if (chosen.length < 4) return null;

  const keep = new Set(chosen.map((c) => c.word));
  const edges: TermEdge[] = [];
  for (const [k, c] of pairs) {
    const sep = k.indexOf("\x00");
    const a = k.slice(0, sep);
    const b = k.slice(sep + 1);
    if (!keep.has(a) || !keep.has(b)) continue;
    // Positive pointwise mutual information: how much more often these two sit
    // together than they would if scattered independently. This keeps real
    // collocations and discards pairs that are merely both common.
    const pmi = Math.log((c * seq.length) / (count.get(a)! * count.get(b)!));
    if (pmi <= 0) continue;
    edges.push({ a, b, pmi });
  }

  const terms: Term[] = chosen.map((c) => ({
    word: c.word,
    weight: c.weight,
    firstAt: firstAt.get(c.word)!,
  }));
  return { terms, edges };
}

/**
 * Coordinates live in a 0-100 space on both axes so the same data renders
 * into any container shape.
 */
export function generatePortrait(content: string): Portrait {
  const seed = hashContent(content);
  const rng = createRNG(seed);

  const data = extractTerms(content);
  if (!data) return emptyPortrait(rng);

  const { terms, edges } = data;
  const hueShift = -12 + rng() * 24;

  // Hashing a word straight to a position is what made earlier versions look
  // patchy. Thirty independent samples do not cover a rectangle evenly; they
  // reliably leave voids in some regions and clumps in others, which reads as
  // a crowded middle inside empty margins. Giving every term its own band
  // instead makes coverage even by construction, and jitter within the band
  // keeps it from looking like a grid.
  //
  // Both axes mean something. Columns follow the order in which ideas first
  // appear, so reading left to right follows the post, and terms that occur
  // together land near each other because they get introduced together. That
  // is also why most edges come out short. Height within a column derives
  // from the term itself.
  const DISPLAY_ASPECT = 2.6;
  const cols = Math.max(
    4,
    Math.min(12, Math.round(Math.sqrt(terms.length * DISPLAY_ASPECT))),
  );

  const unit = (word: string, salt: string) =>
    hashStr(word + "\x00" + salt) / 4294967296;

  const byAppearance = [...terms].sort((a, b) => a.firstAt - b.firstAt);
  const placed: Array<{ term: Term; x: number; y: number }> = [];

  for (let c = 0; c < cols; c++) {
    const from = Math.ceil((c * byAppearance.length) / cols);
    const to = Math.ceil(((c + 1) * byAppearance.length) / cols);
    const column = byAppearance
      .slice(from, to)
      .map((term) => ({ term, row: unit(term.word, "row") }))
      .sort((a, b) => a.row - b.row);

    // Bands keep the terms in one column apart, but if every column split the
    // height at the same places the gaps between bands would line up into
    // visible horizontal lanes. Rotating each column by its own offset means
    // one column's gap falls where another column has a term.
    const phase = unit(`column ${c}`, "phase");

    column.forEach(({ term, row }, k) => {
      // Sit inside the middle 70% of the band so neighbours never collide.
      const bx = (c + 0.15 + 0.7 * unit(term.word, "col")) / cols;
      const by = ((k + 0.15 + 0.7 * row) / column.length + phase) % 1;
      placed.push({ term, x: 2 + bx * 96, y: 2 + by * 96 });
    });
  }

  // TextRank weights are heavily skewed, so take a square root before mapping
  // to radius. Otherwise one term is a disc and the rest are identical specks.
  const maxWeight = Math.max(...terms.map((t) => t.weight));
  const minRadius = 0.52;
  const maxRadius = 1.0;

  const pointColors: Array<{ hue: number; sat: number; lit: number }> = [];
  const pointIndex = new Map<string, number>();

  const points: PortraitPoint[] = placed.map(({ term, x, y }, i) => {
    pointIndex.set(term.word, i);
    const w = term.weight / maxWeight;
    const c = {
      hue: (((wordHue(term.word) + hueShift) % 360) + 360) % 360,
      sat: 40 + w * 20,
      lit: 38 + (1 - w) * 15,
    };
    pointColors.push(c);
    return {
      x,
      y,
      color: hsl(c),
      radius: minRadius + Math.sqrt(w) * (maxRadius - minRadius),
    };
  });

  // Length is measured in the shape the portrait is actually seen in, not in
  // the square the coordinates live in. Every surface is far wider than it is
  // tall (roughly 3:1 in the post header, 1.9:1 for Open Graph, 1.75:1 in the
  // list), so without this weighting a horizontal pair reads as a long streak
  // while a vertical pair of the same measured length looks tight.
  //
  // The degree cap is what produces wandering chains rather than a starburst
  // around whichever term co-occurs with everything.
  const ASPECT = 2.4;
  const EDGE_MAX_LEN = 36;
  const RESCUE_MAX_LEN = 54;
  const MAX_DEGREE = 2;

  const measured = edges
    .map((e) => {
      const a = pointIndex.get(e.a)!;
      const b = pointIndex.get(e.b)!;
      return {
        a,
        b,
        pmi: e.pmi,
        len: Math.hypot(
          (points[a].x - points[b].x) * ASPECT,
          points[a].y - points[b].y,
        ),
      };
    })
    .sort((p, q) => p.len - q.len);

  const degree = new Int32Array(points.length);
  const kept: typeof measured = [];

  // Shortest first, so a term spends its allowance on its closest links.
  for (const m of measured) {
    if (m.len > EDGE_MAX_LEN) break;
    if (degree[m.a] >= MAX_DEGREE || degree[m.b] >= MAX_DEGREE) continue;
    kept.push(m);
    degree[m.a]++;
    degree[m.b]++;
  }

  // A term left with no visible edge reads as dust rather than part of the
  // constellation, so give each one its closest real link back, provided that
  // link is not long enough to re-create the tangle.
  for (const m of measured) {
    if (m.len <= EDGE_MAX_LEN || m.len > RESCUE_MAX_LEN) continue;
    if (degree[m.a] > 0 && degree[m.b] > 0) continue;
    const partner = degree[m.a] === 0 ? m.b : m.a;
    if (degree[partner] > MAX_DEGREE) continue;
    kept.push(m);
    degree[m.a]++;
    degree[m.b]++;
  }

  const maxPmi = Math.max(...kept.map((m) => m.pmi), 1e-6);

  const lines: PortraitLine[] = kept.map((m) => {
    const ca = pointColors[m.a];
    const cb = pointColors[m.b];

    let dh = cb.hue - ca.hue;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    const color = hsl({
      hue: ca.hue + dh * 0.5,
      sat: (ca.sat + cb.sat) * 0.5,
      lit: (ca.lit + cb.lit) * 0.5,
    });

    const tie = Math.min(1, m.pmi / maxPmi);
    const lenNorm = Math.min(1, m.len / EDGE_MAX_LEN);
    // Fade over the whole possible span, including rescued edges, so the
    // longest ones stay faint without dropping below what a screen can show.
    const fade = Math.min(1, m.len / RESCUE_MAX_LEN);

    return {
      a: m.a,
      b: m.b,
      color,
      opacity: (0.2 + tie * 0.38) * (1 - 0.42 * fade),
      width: Math.min(1.2, 0.3 + tie * 0.5 + (1 - lenNorm) * 0.25),
    };
  });

  return { points, lines };
}

/** Minimal fallback for very short content. */
function emptyPortrait(rng: () => number): Portrait {
  const count = 8 + Math.floor(rng() * 5);
  const points: PortraitPoint[] = [];
  for (let i = 0; i < count; i++) {
    points.push({
      x: 5 + rng() * 90,
      y: 5 + rng() * 90,
      color: `hsl(${40 + rng() * 60}, ${40 + rng() * 15}%, ${38 + rng() * 15}%)`,
      radius: 0.3 + rng() * 0.5,
    });
  }
  // Connect a few nearest pairs
  const lines: PortraitLine[] = [];
  for (let i = 0; i < points.length; i++) {
    let bestJ = -1;
    let bestD = Infinity;
    for (let j = 0; j < points.length; j++) {
      if (j === i) continue;
      const d = (points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2;
      if (d < bestD) {
        bestD = d;
        bestJ = j;
      }
    }
    if (bestJ > i && bestD < 400) {
      lines.push({
        a: i,
        b: bestJ,
        color: points[i].color,
        opacity: 0.15,
        width: 0.3,
      });
    }
  }
  return { points, lines };
}

export function portraitSVG(content: string, width = 1200, height = 630): string {
  const { points, lines } = generatePortrait(content);
  const px = (v: number) => ((v / 100) * width).toFixed(2);
  const py = (v: number) => ((v / 100) * height).toFixed(2);
  const r = (v: number) => (v * Math.min(width, height) * 0.007).toFixed(2);
  const sw = (v: number) => (v * 2.5).toFixed(2);

  const lineEls = lines
    .map((l) => {
      const a = points[l.a];
      const b = points[l.b];
      return `<line x1="${px(a.x)}" y1="${py(a.y)}" x2="${px(b.x)}" y2="${py(b.y)}" stroke="${l.color}" stroke-width="${sw(l.width)}" stroke-opacity="${l.opacity.toFixed(3)}"/>`;
    })
    .join("");

  const dotEls = points
    .map((p) => `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="${r(p.radius)}" fill="${p.color}"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f2edd9"/>${lineEls}${dotEls}</svg>`;
}
