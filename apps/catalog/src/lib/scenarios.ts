import type { Component } from "svelte";
import EditorialArticle from "./scenarios/EditorialArticle.svelte";
import WikiArticle from "./scenarios/WikiArticle.svelte";
import Social from "./scenarios/Social.svelte";
import DataScenario from "./scenarios/Data.svelte";
import FormsScenario from "./scenarios/Forms.svelte";

export interface ScenarioDef {
  id: string;
  name: string;
  description: string;
  component: Component;
}

export const scenarios: readonly ScenarioDef[] = [
  {
    id: "editorial-article",
    name: "Artículo editorial",
    description:
      "Portada de revista: cabecera, meta, tags, cuerpo, galería, autor y navegación.",
    component: EditorialArticle,
  },
  {
    id: "wiki-article",
    name: "Artículo wiki",
    description:
      "Página de conocimiento: TOC con scroll-spy, citas, referencias, progreso y anchors.",
    component: WikiArticle,
  },
  {
    id: "social",
    name: "Interacción social",
    description:
      "Autor, compartir y hilo de comentarios con respuestas anidadas.",
    component: Social,
  },
  {
    id: "data",
    name: "Componentes de datos",
    description:
      "Tabla, paginación, filtros, índice, ranking y grille con datos coherentes.",
    component: DataScenario,
  },
  {
    id: "forms",
    name: "Formularios",
    description: "Todos los controles de formulario con validación en vivo.",
    component: FormsScenario,
  },
];

export function scenarioById(id: string): ScenarioDef | undefined {
  return scenarios.find((s) => s.id === id);
}
