import type { Lang } from "../i18n/ui";

type Localized = Record<Lang, string>;

export interface Build {
  repo: string;
  url: string;
  // What was quantized, and what the build is for.
  summary: Localized;
  // Headline measurement from the model card, if one was published.
  metric?: { value: string; label: Localized };
}

export interface Project {
  // Anchor on the Projects page; the homepage tiles link to it.
  id: string;
  title: string;
  description: Localized;
  original: { name: string; url: string };
  license: string;
  // Memory footprint before and after quantization, drawn as a grid in
  // which every square holds `cell` units (GB unless `unit` says MB). When a
  // repo holds several checkpoints, `scope` names the one the numbers describe.
  size: {
    from: number;
    to: number;
    unit?: "GB" | "MB";
    cell: number;
    cols: number;
    approx?: boolean;
    scope?: Localized;
  };
  builds: Build[];
  // Slug of a blog post that evaluates this project, if there is one.
  writeup?: string;
}

export interface ProjectGroup {
  id: string;
  label: Localized;
  items: Project[];
}

const agreement: Localized = {
  en: "next-token agreement with bf16",
  es: "mismo token siguiente que bf16",
};

const sameAnswer: Localized = {
  en: "same answer as the original",
  es: "misma respuesta que el original",
};

// Grouped so open-source repositories can be added later as another group
// without touching the section layout. Newest first; with an odd count, the
// last item spans both columns on wide screens.
export const projectGroups: ProjectGroup[] = [
  {
    id: "models",
    label: {
      en: "Open-weight models on Hugging Face",
      es: "Modelos open-weight en Hugging Face",
    },
    items: [
      {
        id: "laya",
        title: "laya",
        description: {
          en: "A model that labels, scores or routes a ticket or an email in one forward pass. One build keeps the original's speed and repeatable answers; the other needs as little as a third of the GPU memory, but batching can change its answers.",
          es: "Un modelo que clasifica, puntúa o deriva un ticket o un correo en una sola pasada. Un build mantiene la velocidad del original y respuestas repetibles; el otro puede ocupar apenas un tercio de la memoria de GPU, pero sus respuestas pueden cambiar según cómo se agrupen las consultas.",
        },
        original: {
          name: "laya (ModernBERT, mmBERT)",
          url: "https://huggingface.co/convaiinnovations/laya",
        },
        license: "Apache 2.0",
        size: {
          from: 843,
          to: 349,
          unit: "MB",
          cell: 30,
          cols: 7,
          scope: { en: "English checkpoint", es: "Checkpoint en inglés" },
        },
        builds: [
          {
            repo: "hoja-solutions/laya-NVFP4A16",
            url: "https://huggingface.co/hoja-solutions/laya-NVFP4A16",
            summary: {
              en: "4-bit weights, bf16 activations",
              es: "pesos de 4 bits, activaciones bf16",
            },
            metric: { value: "89.1%", label: sameAnswer },
          },
          {
            repo: "hoja-solutions/laya-NVFP4",
            url: "https://huggingface.co/hoja-solutions/laya-NVFP4",
            summary: {
              en: "4-bit weights and activations",
              es: "pesos y activaciones de 4 bits",
            },
            metric: { value: "83.8%", label: sameAnswer },
          },
        ],
      },
      {
        id: "humanizer",
        title: "humanizer",
        description: {
          en: "A model that rewrites AI-written drafts in English and Chinese so they read as human. We published two 4-bit builds: one that stays close to full precision, and one that trades fidelity for throughput on Blackwell's FP4 tensor cores.",
          es: "Un modelo que reescribe borradores escritos por IA en inglés y en chino para que se lean como humanos. Publicamos dos builds de 4 bits: uno que se mantiene cerca de la precisión completa y otro que cambia fidelidad por velocidad en los tensor cores FP4 de Blackwell.",
        },
        original: {
          name: "humanizer (Gemma 4 12B)",
          url: "https://huggingface.co/jialinyyzz/humanizer",
        },
        license: "Apache 2.0",
        size: { from: 23.9, to: 8.25, cell: 1, cols: 8 },
        builds: [
          {
            repo: "hoja-solutions/humanizer-NVFP4A16",
            url: "https://huggingface.co/hoja-solutions/humanizer-NVFP4A16",
            summary: {
              en: "4-bit weights, bf16 activations",
              es: "pesos de 4 bits, activaciones bf16",
            },
            metric: { value: "94.77%", label: agreement },
          },
          {
            repo: "hoja-solutions/humanizer-NVFP4",
            url: "https://huggingface.co/hoja-solutions/humanizer-NVFP4",
            summary: {
              en: "4-bit weights and activations",
              es: "pesos y activaciones de 4 bits",
            },
            metric: { value: "90.05%", label: agreement },
          },
        ],
        writeup: "humanizer-model-vs-skill",
      },
      {
        id: "latamgpt",
        title: "LatamGPT 70B",
        description: {
          en: "We quantized the LatamGPT project's 70B model, built on Llama 3.1, to 4-bit weights and activations for Blackwell GPUs, and calibrated it on Spanish data on a single RTX 5090 workstation. We haven't published quality evaluations yet.",
          es: "Cuantizamos el modelo de 70B del proyecto LatamGPT, construido sobre Llama 3.1, a pesos y activaciones de 4 bits para GPUs Blackwell, y lo calibramos con datos en español en una sola estación de trabajo con una RTX 5090. Todavía no publicamos evaluaciones de calidad.",
        },
        original: {
          name: "LatamGPT (Llama 3.1 70B)",
          url: "https://huggingface.co/latam-gpt/Llama-3.1-70B-LatamGPT-SFT-1.0",
        },
        license: "Llama 3.1 Community License",
        size: { from: 140, to: 40, cell: 4, cols: 7, approx: true },
        builds: [
          {
            repo: "hoja-solutions/Llama-3.1-70B-LatamGPT-SFT-1.0-NVFP4",
            url: "https://huggingface.co/hoja-solutions/Llama-3.1-70B-LatamGPT-SFT-1.0-NVFP4",
            summary: {
              en: "4-bit weights and activations · Blackwell GPUs with vLLM",
              es: "pesos y activaciones de 4 bits · GPUs Blackwell con vLLM",
            },
          },
        ],
      },
    ],
  },
];
