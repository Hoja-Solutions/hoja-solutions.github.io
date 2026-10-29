import type { Lang } from "../i18n/ui";

type Localized = Record<Lang, string>;

// Each visual is a small drawing in ClientTabs.astro; the keys pair them up.
export type Visual = "assistant" | "connector" | "widgets" | "evaluation" | "pipeline";

export interface ClientProject {
  title: Localized;
  description: Localized;
  // The kind of work, in a few words.
  area: Localized;
  visual: Visual;
}

export interface Client {
  // Anchor on the Projects page; opening it selects this client's tab.
  id: string;
  name: string;
  // Tab label on phones, where the logos would be too small to read.
  short: string;
  // Monochrome logo in /public/logos/clients, shown `shown` px tall on the
  // tab. `named` is true when the logo already spells the client's name, so
  // the name isn't repeated beside it.
  logo: { src: string; width: number; height: number; shown: number; named: boolean };
  about: Localized;
  place: Localized;
  link: { label: string; url: string };
  projects: ClientProject[];
}

// Most recent first; the first client's tab is open when the page loads. A
// client with a single project shows it beside a larger drawing.
export const clients: Client[] = [
  {
    id: "maximo",
    name: "Máximo",
    short: "Máximo",
    logo: { src: "/logos/clients/maximo.svg", width: 121, height: 31, shown: 22, named: true },
    about: {
      en: "Fintech with a card and a digital wallet.",
      es: "Fintech con una tarjeta y una billetera digital.",
    },
    place: { en: "Lima, Peru", es: "Lima, Perú" },
    link: { label: "maximo.pe", url: "https://maximo.pe/" },
    projects: [
      {
        title: { en: "Max, the banking assistant", es: "Max, el asistente bancario" },
        description: {
          en: "An AI assistant that serves Máximo's customers on WhatsApp and in the app. It handles everyday account requests and hands complex cases to a person.",
          es: "Un asistente de IA que atiende a los clientes de Máximo por WhatsApp y en la app. Resuelve las consultas del día a día sobre su cuenta y deriva los casos complejos a una persona.",
        },
        area: { en: "AI agents · Customer support", es: "Agentes de IA · Atención al cliente" },
        visual: "assistant",
      },
      {
        title: { en: "Máximo in Claude", es: "Máximo en Claude" },
        description: {
          en: "A secure connector that lets each customer use their own Máximo account from Claude, with sensitive actions confirmed in the app.",
          es: "Un conector seguro para que cada cliente use su propia cuenta de Máximo desde Claude, con las acciones sensibles confirmadas en la app.",
        },
        area: { en: "MCP · Integrations", es: "MCP · Integraciones" },
        visual: "connector",
      },
      {
        title: { en: "Widgets inside the chat", es: "Widgets dentro del chat" },
        description: {
          en: "In the mobile app, the assistant answers with interactive widgets instead of plain text. We built them together with Máximo's mobile team.",
          es: "En la app móvil, el asistente responde con widgets interactivos en lugar de solo texto. Los construimos junto al equipo mobile de Máximo.",
        },
        area: { en: "Generative UI · Mobile", es: "UI generativa · Móvil" },
        visual: "widgets",
      },
    ],
  },
  {
    id: "necc",
    name: "The New England Center for Children",
    short: "NECC",
    logo: { src: "/logos/clients/necc.svg", width: 2517, height: 750, shown: 40, named: true },
    about: {
      en: "Autism education and research center.",
      es: "Centro de educación e investigación sobre autismo.",
    },
    place: { en: "Massachusetts, USA", es: "Massachusetts, EE. UU." },
    link: { label: "necc.org", url: "https://www.necc.org/" },
    projects: [
      {
        title: { en: "Language models on their own hardware", es: "Modelos de lenguaje en su propio hardware" },
        description: {
          en: "We evaluated open-weight models that NECC could run on its own infrastructure, measuring speed and resource use under load to choose the right fit.",
          es: "Evaluamos modelos open-weight que NECC pudiera ejecutar en su propia infraestructura, midiendo velocidad y uso de recursos bajo carga para elegir el más adecuado.",
        },
        area: { en: "Open models · Model serving", es: "Modelos abiertos · Serving de modelos" },
        visual: "evaluation",
      },
    ],
  },
  {
    id: "sankio",
    name: "Sankio del Perú",
    short: "Sankio",
    logo: { src: "/logos/clients/sankio.svg", width: 200, height: 200, shown: 28, named: false },
    about: {
      en: "Industrial solutions and technical consulting firm.",
      es: "Empresa de soluciones industriales y consultoría técnica.",
    },
    place: { en: "Lima, Peru", es: "Lima, Perú" },
    link: { label: "LinkedIn", url: "https://www.linkedin.com/company/sankiodelperu/" },
    projects: [
      {
        title: { en: "Data science for Sankio's clients", es: "Ciencia de datos para los clientes de Sankio" },
        description: {
          en: "Through Sankio, we brought data science, data engineering and analytics to companies in banking, logistics and food services.",
          es: "A través de Sankio, llevamos ciencia de datos, ingeniería de datos y analítica a empresas de banca, logística y servicios de alimentos.",
        },
        area: { en: "Data science · Analytics", es: "Ciencia de datos · Analítica" },
        visual: "pipeline",
      },
    ],
  },
];
