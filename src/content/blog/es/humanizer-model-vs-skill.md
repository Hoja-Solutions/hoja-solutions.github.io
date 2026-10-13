---
title: "Humanizar texto de IA: un 12B con ajuste fino frente a modelos generales con un archivo de reglas"
description: "Le dimos a nueve configuraciones los mismos siete borradores escritos por IA y pedimos tres reescrituras de cada uno. El modelo entrenado para la tarea fue por lejos el más rápido y reformuló la mayoría de las citas que su propio prompt le ordena conservar. Los modelos generales que siguieron el skill abierto humanizer conservaron casi todo, incluido un 27B corriendo en la misma GPU."
date: 2026-10-12T12:00:00
tags: ["IA", "Ingeniería", "Open Source"]
---

Corrimos 189 reescrituras para comparar dos maneras de lograr que un texto escrito por IA se lea como si lo hubiera escrito una persona. En una sola RTX 5090, un modelo de 12B ajustado exactamente para esta tarea terminó 21 reescrituras en 11 segundos en nuestro build de 4 bits. Su propio prompt dice que cada cita debe sobrevivir sin cambios, y sus tres builds conservaron entre 20 y 23 de las 57 citas que revisamos. Cuatro modelos Claude y un Qwen3.8-27B local, todos siguiendo un conjunto publicado de reglas de edición, tardaron mucho más y conservaron entre 46 y 51.

Los dos enfoques comparten nombre, así que conviene separarlos primero. El [modelo humanizer](https://huggingface.co/jialinyyzz/humanizer) es un fine-tune de Gemma 4 12B que reescribe borradores en inglés y en chino conservando cada número, nombre, fecha y cita. El [skill humanizer](https://github.com/blader/humanizer) es un archivo de instrucciones open-source para asistentes de IA, sin relación con el modelo, construido sobre [la guía de Wikipedia sobre las señales de escritura con IA](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing).

## Qué comparamos

Participaron nueve configuraciones. Tres son el modelo humanizer: el original en precisión completa y dos builds de 4 bits que hicimos con GPTQ, uno que cuantiza solo los pesos y otro que cuantiza pesos y activaciones. Las otras seis son modelos de propósito general con el skill. Dos corrieron en la misma GPU que el modelo humanizer: [Qwen3.8-27B](/es/blog/qwen38-27b-local) en un build NVFP4 de 4 bits, y gpt-oss-20b en el formato MXFP4 con el que se publicó. Las cuatro restantes fueron Claude Haiku 5.5, Sonnet 5.5, Opus 5.5 y Fable 5.1, cada una corriendo vía Claude Code.

| Configuración | Pesos | Dónde corrió | Instrucciones |
| --- | --- | --- | --- |
| humanizer, bf16 | fine-tune de Gemma 4 12B, 23.9 GB | RTX 5090, vLLM 0.30.0 | su propio prompt de entrenamiento |
| humanizer, NVFP4A16 | pesos de 4 bits, 8.25 GB | RTX 5090, vLLM 0.30.0 | su propio prompt de entrenamiento |
| humanizer, NVFP4 | pesos y activaciones de 4 bits, 8.25 GB | RTX 5090, vLLM 0.30.0 | su propio prompt de entrenamiento |
| Qwen3.8-27B | build NVFP4 de 4 bits | RTX 5090, vLLM 0.30.0 | skill como prompt de sistema |
| gpt-oss-20b | mezcla de expertos de 21B, MXFP4 | RTX 5090, vLLM 0.30.0 | skill como prompt de sistema |
| Claude Haiku 5.5 | no divulgado | Anthropic, vía Claude Code | skill cargado por el modelo |
| Claude Sonnet 5.5 | no divulgado | Anthropic, vía Claude Code | skill cargado por el modelo |
| Claude Opus 5.5 | no divulgado | Anthropic, vía Claude Code | skill cargado por el modelo |
| Claude Fable 5.1 | no divulgado | Anthropic, vía Claude Code | skill cargado por el modelo |

El skill, versión 2.9.1, es un archivo de 30 KB. Describe 33 patrones de escritura con IA con ejemplos de antes y después, prohíbe inventar hechos y pide un borrador, una auditoría breve y una reescritura final. Solo puntuamos la reescritura final. El prompt del modelo humanizer, aquel con el que fue entrenado, es lo bastante corto como para citarlo entero:

```
Rewrite the text below so it reads like a person wrote it, not a language model.

Reorganize it as you see fit. Vary sentence length on purpose. Cut hedging,
throat-clearing, and any sentence that only announces what comes next.
Prefer the concrete word over the abstract one. It is fine to sound uneven.

Every fact, number, unit, date, name and quotation must survive unchanged.
```

Cada modelo corrió con su configuración de muestreo habitual, y cada configuración reescribió cada borrador tres veces: semillas 0, 1 y 2 para los modelos locales, y un subagente nuevo de Claude Code para cada reescritura con Claude.

## Los borradores, y una trampa

Seis borradores vienen del conjunto de evaluación reservado de los autores de humanizer, ninguno de los cuales se usó para entrenar el modelo. Los escribieron modelos comerciales a los que se les pidió documentos comunes, y elegimos cuatro borradores en inglés y dos en chino cargados de números, nombres, fechas y citas.

| Borrador | Tipo | Idioma | Escrito por | Números | Citas | ID en el conjunto |
| --- | --- | --- | --- | --- | --- | --- |
| memo | memo de políticas | EN | Claude Sonnet | 27 | 0 | `300b/memo_policy_11_sonnet` |
| email | correo de trabajo | EN | GLM-5.3 | 16 | 1 | `300a/email_work_05_glm` |
| blog | post de blog personal | EN | GPT-5.6 Luna | 12 | 3 | `300b/blog_personal_01_luna` |
| paper | paper, sección de resultados | EN | Claude Sonnet | 43 | 0 | `300a/paper_section_08_sonnet` |
| zh-report | informe anual de un club estudiantil | ZH | GPT-5.6 Luna | 25 | 5 | `300b/zh_report_03_luna` |
| zh-zhihu | respuesta en un sitio de preguntas y respuestas | ZH | GLM-5.3 | 18 | 9 | `300a/zh_zhihu_12_glm` |
| trampa | noticia local | EN | escrito para esta prueba | 14 | 1 | ninguno |

El séptimo borrador es una noticia inventada sobre la rotura de una tubería matriz de agua, escrita para que parezca hecha por una máquina. Citamos los ejemplos en su inglés original. Empieza así:

> On Tuesday, March 3, 2026, a 600 mm water main ruptured beneath Calloway Avenue at approximately 4:40 a.m., leaving an estimated 12,400 households without running water — a disruption that underscores the crucial importance of resilient infrastructure.

Debajo de las marcas de estilo esconde 15 cosas que una reescritura cuidadosa tiene que conservar: una cita de la directora de operaciones de la empresa de agua que debe quedar palabra por palabra, dos listas que deben quedar completas, el carácter no verificado de los hallazgos, la causa no determinada, la ausencia de heridos, la inundación "menor", un límite diario de 18 litros y seis atenuadores, las expresiones de cautela como "aproximadamente" o "hasta". Termina con un párrafo sobre un "poderoso recordatorio" que no dice nada, y que el skill indica recortar.

Los atenuadores son el punto. "Un estimado de 12 400 hogares" y "12 400 hogares" son afirmaciones distintas, igual que "hasta 18 litros" y "18 litros". Una edición que quita el atenuador por estilo convierte una estimación en un conteo.

## Cómo lo puntuamos

Un script revisó cada reescritura final. Cada número del borrador tiene que aparecer en la reescritura, y los cambios de formato cuentan como conservados, así que "$180,000" como "$180K" o "three" como 3 pasan; eso suma 465 chequeos por configuración a lo largo de sus 21 reescrituras. Los números nuevos de tres o más dígitos cuentan como agregados. Cada pasaje entre comillas del borrador tiene que aparecer sin cambios, 57 chequeos por configuración. Los 15 puntos de la trampa se revisan en cada una de sus tres reescrituras, y un atenuador cuenta como conservado cuando su sentido sobrevive con otras palabras. El script también cuenta las rayas largas y medias, que el skill prohíbe, y las palabras de la lista del skill de vocabulario de IA sobreusado por cada 1000 palabras.

Cada chequeo fallido de la trampa se leyó a mano y se confirmó. Donde una regla marcó un cambio de redacción o de formato en lugar de una pérdida real, corregimos la regla y volvimos a puntuar todo. Son chequeos de coincidencia de texto: atrapan un número perdido o una cita reformulada, y no pueden decir si una reescritura se lee como humana, que es justamente para lo que existe el modelo humanizer.

## Resultados

| Configuración | Números perdidos (EN / ZH) | Números agregados | Citas conservadas | Chequeos de la trampa | Rayas restantes | Palabras de IA por cada 1000 |
| --- | --- | --- | --- | --- | --- | --- |
| humanizer, bf16 | 2 / 0 | 2 | 22 de 57 | 38 de 45 | 2 | 1.3 |
| humanizer, NVFP4A16 | 0 / 1 | 2 | 20 de 57 | 37 de 45 | 0 | 0.8 |
| humanizer, NVFP4 | 0 / 2 | 1 | 23 de 57 | 37 de 45 | 1 | 0.0 |
| Qwen3.8-27B + skill | 0 / 5 | 0 | 50 de 57 | 45 de 45 | 6 | 0.0 |
| gpt-oss-20b + skill | 8 / 16 | 0 | 32 de 57 | 41 de 45 | 18 | 0.5 |
| Claude Haiku 5.5 + skill | 0 / 4 | 0 | 51 de 57 | 45 de 45 | 0 | 0.0 |
| Claude Sonnet 5.5 + skill | 1 / 0 | 0 | 48 de 57 | 45 de 45 | 0 | 0.0 |
| Claude Opus 5.5 + skill | 0 / 2 | 0 | 46 de 57 | 45 de 45 | 0 | 0.4 |
| Claude Fable 5.1 + skill | 0 / 3 | 0 | 47 de 57 | 45 de 45 | 0 | 0.2 |

Los números se sostuvieron casi en todas partes. Los modelos Claude y Qwen perdieron entre 1 y 5 de sus 465, sobre todo fechas en el informe del club en chino. El modelo humanizer perdió 1 o 2 y agregó 1 o 2; en un caso convirtió "full health benefits" en "100%". gpt-oss perdió 24, incluida una reescritura del memo que eliminó la cantidad de personas de cada departamento.

Las citas son donde el especialista rompió su propia regla. Sus tres builds conservaron entre 20 y 23 de 57, nunca conservaron palabra por palabra la cita de la trampa, y pasaron solo 2 o 3 de los 27 chequeos de citas en la respuesta de Zhihu, que cita nueve entrevistas. Los modelos Claude y Qwen conservaron entre 46 y 51, y todas las citas que perdieron estaban en esa misma respuesta de Zhihu. gpt-oss conservó 32.

Ninguna reescritura de Claude contiene una raya larga o media. Qwen dejó 6 en sus 15 reescrituras en inglés y gpt-oss dejó 18, y gpt-oss además esparció guiones de no separación y espacios estrechos de no separación en 15 de sus 21 reescrituras, que pueden aparecer como caracteres raros cuando el texto se pega en otro lugar. Las palabras de IA listadas casi no aparecen. Todas las configuraciones mantuvieron la longitud entre 92 y 103 por ciento de la fuente.

## Dónde los atrapó la trampa

| Chequeo | hum. bf16 | hum. NVFP4A16 | hum. NVFP4 | gpt-oss | Claude y Qwen |
| --- | --- | --- | --- | --- | --- |
| La cita de la directora queda palabra por palabra | 0 | 0 | 0 | 2 | 3 |
| El aviso "podría" tardar de 48 a 72 horas | 3 | 3 | 2 | 3 | 3 |
| Las 4:40 a.m. siguen siendo aproximadas | 2 | 3 | 3 | 3 | 3 |
| Hervir "al menos" un minuto | 3 | 2 | 3 | 3 | 3 |
| "Hasta" 18 litros | 3 | 2 | 2 | 3 | 3 |
| Desaparece el párrafo final vacío | 0 | 0 | 0 | 0 | 3 |

Aprobados sobre tres reescrituras. Todas las configuraciones pasaron los otros nueve chequeos en las tres, y la última columna cubre a los cuatro modelos Claude y a Qwen, que pasaron todo.

La fila del párrafo final premia el objetivo propio del skill. El skill le dice al modelo que recorte una despedida genérica, y al modelo humanizer nunca se le pidió eso, así que reescribió el párrafo con su propia voz cada vez. gpt-oss lo redujo a una sola oración que igual se lee como moraleja. La fila de la cita es distinta: es un objetivo que ambos lados comparten, porque el prompt de humanizer dice que cada cita debe sobrevivir sin cambios, y el modelo falló en las nueve reescrituras de la trampa.

Los atenuadores dejan ver un conflicto dentro del prompt de humanizer. Le pide al modelo recortar la atenuación y, dos líneas después, conservar cada hecho sin cambios, y en una afirmación atenuada esas instrucciones chocan porque el atenuador es parte del hecho. El modelo resolvió el choque casi siempre a favor de los hechos, y quitó un atenuador cinco veces en nueve reescrituras de la trampa.

## Cómo se ven las fallas

La cita de la directora, tal como la da la trampa:

> "We are not ruling anything out, including ground movement from the nearby tunnel works," said NWA operations director Helena Ostrowska at a 10:00 a.m. briefing.

El humanizer en precisión completa, primera reescritura:

> "We're not discounting anything, including potential ground shifts from the tunnel works going on nearby,"

El build NVFP4A16, primera reescritura:

> "We're not discounting any possibilities. This could be related to ground movements from the nearby tunnel works."

La segunda versión hace más que reformular. La directora dijo que no descartaba las obras del túnel, y la reescritura la hace sugerir que podrían ser la causa, una afirmación distinta atribuida a una persona con nombre y apellido, entre comillas.

El párrafo final de la trampa:

> Ultimately, this incident serves as a powerful reminder that aging infrastructure is not just an engineering problem — it is a community challenge that demands investment, vigilance, and collaboration. By working together, Northfield can build a more resilient future.

El humanizer en precisión completa lo conservó y cambió un conjunto de marcas por otro:

> But most importantly, this incident really highlights the fact that the issue of ageing infrastructure is not just an engineering problem. It's an issue for the entire community. It requires investment. And attention. And cooperation. Because together we can make Northfield more resilient.

Claude Opus y Qwen, en sus primeras reescrituras, lo eliminaron y terminaron en el último hecho:

> No injuries were reported. Two businesses on Calloway Avenue reported minor basement flooding.

El registro es la otra diferencia que se nota al leer las salidas. El modelo humanizer escribe con una voz casual, de foro, sin importar la fuente. Un correo de trabajo que empezaba con "End-of-shift handoff for today, Thursday, June 12" volvió así:

> Hey Marcus, end of day shift/hand off today Thursday 6/12. We have 3 outstanding orders still in ERP that need your work on them tonight.

En las reescrituras que leímos, los modelos guiados por el skill se mantuvieron más cerca del registro de cada fuente.

## La velocidad, y en qué se va el tiempo

| Configuración | Tiempo | Tokens |
| --- | --- | --- |
| humanizer, bf16 | 21 reescrituras en 28 s, un solo lote | unos 520 de salida por reescritura |
| humanizer, ambos builds de 4 bits | 21 reescrituras en 11 s, un solo lote | unos 510 de salida por reescritura |
| Qwen3.8-27B + skill | 67 s por respuesta en promedio, 4 a la vez | 3681 de salida por respuesta, sobre todo razonamiento |
| gpt-oss-20b + skill | 51 s por respuesta en promedio, 4 a la vez | 8317 de salida por respuesta, sobre todo razonamiento |
| Claude Haiku 5.5 + skill | 15 a 32 s por corrida | 49 000 a 54 000 en total por corrida |
| Claude Sonnet 5.5 + skill | 13 a 25 s por corrida | 47 000 a 50 000 en total por corrida |
| Claude Opus 5.5 + skill | 39 a 108 s por corrida | 50 000 a 58 000 en total por corrida |
| Claude Fable 5.1 + skill | 41 a 225 s por corrida | 49 000 a 65 000 en total por corrida |

Los tiempos de Claude son de reloj para una corrida completa de un subagente de Claude Code, con hasta 20 corriendo en paralelo, y sus conteos de tokens incluyen las propias instrucciones de Claude Code y el skill, que son la mayor parte de cada corrida.

El modelo humanizer lleva sus instrucciones en los pesos y responde en unos 500 tokens, así que los builds de 4 bits logran alrededor de medio segundo por reescritura dentro de un lote. Los modelos generales leen un archivo de reglas de 30 KB y razonan antes de responder, y los locales gastaron la mayor parte de su salida en ese razonamiento. Las reglas en el contexto cuestan tokens en cada llamada, y puedes leerlas y editarlas. Las reglas en los pesos casi no cuestan nada por llamada, y además traen los hábitos que vinieron con ellas, como un registro casual aplicado a todo.

## Lo que costaron los 4 bits

Nada que pudiéramos medir. El modelo en precisión completa y los dos builds de 4 bits quedan a pocos puntos entre sí en todas las columnas, incluido el build que cuantiza las activaciones además de los pesos. Los archivos de 4 bits pesan 8.25 GB frente a 23.9 GB y terminaron el lote en 11 segundos frente a 28. Ambos son públicos como [humanizer-NVFP4A16](https://huggingface.co/hoja-solutions/humanizer-NVFP4A16) y [humanizer-NVFP4](https://huggingface.co/hoja-solutions/humanizer-NVFP4).

## Lo que esto no mide

El límite más grande está en el método. Medimos si las reescrituras se mantienen fieles a su fuente, y nada sobre si se leen como humanas. Ese es el trabajo real del modelo humanizer, y puede que lo haga mejor que todas las demás configuraciones aquí. No corrimos detectores de IA ni le preguntamos a ningún lector.

Varios chequeos además favorecen al skill. Recortar el párrafo final, evitar las rayas y evitar las palabras listadas son objetivos del skill, y al modelo humanizer nunca se le pidió perseguirlos; su prompt incluso le dice que recorte la atenuación, lo que explica algunos de los atenuadores que perdió. Los números y las citas son la comparación justa, porque ambos prompts los exigen.

La muestra es pequeña, siete borradores con tres reescrituras cada uno, así que los pocos puntos que separan a los modelos Claude son ruido. Las configuraciones no corrieron en condiciones idénticas: los modelos Claude trabajaron dentro de Claude Code, con sus propias instrucciones en contexto, y leyeron el borrador desde un archivo, mientras que los modelos locales recibieron el skill como prompt de sistema, sin más contexto, y el borrador en línea. Qwen y gpt-oss corrieron cuantizados, y sus versiones en precisión completa podrían rendir mejor. Las cifras de velocidad describen una sola RTX 5090 con vLLM 0.30.0. Y según el dataset, dos de los seis borradores de evaluación los escribió Claude Sonnet, lo que podría hacerlos más fáciles de reescribir para los modelos Claude.

Para un pipeline que reescribe texto en volumen, la elección ahora es concreta. El modelo humanizer es una reescritura de medio segundo en una tarjeta, y todo lo que toca necesita después un chequeo de citas. Un modelo general siguiendo el skill conservó casi todos los hechos, y un 27B haciéndolo en esa misma tarjeta igualó a los modelos Claude en citas y en la trampa, a cerca de un minuto por reescritura. Uses el que uses, revisa la fidelidad con un script antes de confiar en la salida. Cada falla de este post la encontró uno que compara cadenas de texto, y ninguna se habría notado en una lectura rápida de un texto fluido.
