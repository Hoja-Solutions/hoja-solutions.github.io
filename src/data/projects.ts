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
  title: string;
  description: Localized;
  original: { name: string; url: string };
  license: string;
  // Memory footprint before and after quantization, drawn as a grid in
  // which every square holds `cell` GB.
  size: { from: number; to: number; cell: number; cols: number; approx?: boolean };
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
  es: "coincidencia del token siguiente con bf16",
};

// Grouped so open-source repositories can be added later as another group
// without touching the section layout.
export const projectGroups: ProjectGroup[] = [
  {
    id: "models",
    label: {
      en: "Open-weight models on Hugging Face",
      es: "Modelos open-weight en Hugging Face",
    },
    items: [
      {
        title: "LatamGPT 70B",
        description: {
          en: "The LatamGPT project's 70B model, built on Llama 3.1, with 4-bit weights and activations for Blackwell GPUs. We calibrated it on Spanish data on a single RTX 5090 workstation. Quality evaluations are still pending.",
          es: "El modelo de 70B del proyecto LatamGPT, construido sobre Llama 3.1, con pesos y activaciones de 4 bits para GPUs Blackwell. Lo calibramos con datos en español en una sola estación de trabajo con una RTX 5090. Las evaluaciones de calidad todavía están pendientes.",
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
      {
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
    ],
  },
];
