---
title: "Cómo construimos el sitio de Hoja con un LLM open-source"
description: "Construimos nuestro sitio de producción con Qwen3.6-27B, un modelo open-source de Alibaba. Qué pueden hacer hoy los modelos open-weight de frontera, y dónde todavía necesitas a una persona en el proceso."
date: 2026-07-21T12:00:00
tags: ["IA", "Ingeniería", "Open Source"]
---

Este es el sitio de producción de Hoja, y lo escribió un modelo open-source. Cada componente, cada línea de texto y el sistema de blog en el que lees esto salieron de [Qwen3.6-27B](https://huggingface.co/Qwen/Qwen3.6-27B), un modelo denso de 27 mil millones de parámetros publicado por el Tongyi Lab de Alibaba bajo licencia Apache 2.0. Lo descargas y lo ejecutas en tu propio hardware. No hay claves de API ni cobro por token.

## La brecha se cerró

Qwen3.6 es el primer modelo open-weight de su serie, publicado en abril de 2026. Maneja texto, imágenes y video a través de un codificador de visión, y su arquitectura combina Gated DeltaNet para atención lineal con Gated Attention estándar. Alibaba lo entrenó con 36 billones de tokens en 119 idiomas, y lee 262 144 tokens de contexto de forma nativa, extensibles más allá de un millón con escalado YaRN. Puedes alternarlo en tiempo de ejecución entre un modo de razonamiento que piensa paso a paso y un modo directo.

Los números que nos importaron fueron los agénticos. Obtiene 77.2 en SWE-bench Verified y 59.3 en Terminal-Bench 2.0, benchmarks que miden si un modelo puede navegar una terminal, editar archivos y entregar software que funciona. Esas son las tareas que le dimos. Un modelo de 27B ahora iguala a los modelos densos de 72B y 80B de hace un año, y Qwen3-32B supera a Qwen2.5-72B con la mitad de los parámetros. Las mejoras vinieron de mejores datos de entrenamiento y mejor arquitectura, no de más escala. Cuantizado, el modelo carga en una sola GPU de consumo con 24 GB de VRAM, responde la mayoría de las solicitudes en menos de un segundo y no cuesta nada por llamada. El rendimiento de una API alojada dejó de ser aquello alrededor de lo cual diseñábamos.

## El bucle

Construir un sitio así es un bucle. Describes el objetivo, el modelo escribe el código, ejecutas el build y arreglas lo que se rompió. El bucle se repite hasta que el build pasa. Cada vuelta toca un archivo o un componente, y lo verificas antes de pasar al siguiente. El modelo escribe la implementación, y tú juzgas si está bien.

Esa división del trabajo funciona porque el modelo maneja ediciones incrementales sin daños colaterales. Pídele que ajuste un componente y cambia ese componente, no la mitad del código. Mantuvo el sistema de diseño en contexto a lo largo de cada edición: los tokens de color, las familias tipográficas y la escala de espaciado sobrevivieron a cada iteración, porque la ventana de 262K mantiene a la vista la estructura del proyecto y toda la conversación a la vez. No olvidó una convención que habíamos fijado tres ediciones antes.

## Lo que resolvió por su cuenta

Algunos momentos mostraron hasta dónde llega esto. Cuando se topó con una API que no reconocía, buscó en la web, trajo la documentación y reescribió el código contra ella. Nunca le entregamos los docs. Cuando pedimos una sección de servicios y luego pedimos recortarla, encontró los dos elementos que se superponían, los eliminó y explicó los recortes. Cuando le pedimos reescribir este post y quitar los tics típicos de la IA, recortó el relleno y las listas de tres elementos por sí mismo. Colocó los archivos en los directorios correctos y escribió los imports, exports y el flujo de datos de un proyecto Astro sin un tutorial delante, porque sus datos de entrenamiento contenían suficientes proyectos reales como para que los patrones ya estuvieran ahí.

## Donde todavía ejecutas el build

El modelo no es autónomo. El primer navbar que escribió usaba enlaces fijos en lugar del enrutamiento de Astro. El build detectó el error y el modelo lo corrigió, pero lo detectó el build, no el modelo. También afirma cosas de las que no está seguro con la misma confianza que las que sabe: nombres de modelos, números de versión, fechas de lanzamiento. Verificamos cada cita antes de publicar. La ventana de 262K se llena a medida que un proyecto crece, así que tú decides qué cargar en la conversación y qué dejar fuera. El modelo no puede sostener todo un código y una conversación larga al mismo tiempo.

Un modelo open-source construyó un sitio de producción, y una versión de 27B supera a los modelos de 72B de hace un año. La próxima generación será más eficiente. Los benchmarks son lo que nos hizo confiarle el trabajo; ser dueños del modelo es lo que hizo que valiera la pena. Tú controlas los datos, y para un equipo con código sensible, esa es la restricción que decide si una herramienta es siquiera usable. Necesitas una computadora y la capacidad de leer un mensaje de error. El modelo escribe el código.
