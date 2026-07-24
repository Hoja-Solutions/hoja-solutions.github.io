---
title: "De una Raspberry Pi a una DGX Spark: el estado de los modelos locales en 2026"
description: "El hardware para sostener un modelo capaz se volvió barato, y los modelos se hicieron lo bastante pequeños para caber. Qué corre en las máquinas de tu cuarto, y los dos números que lo deciden."
date: 2026-07-23
tags: ["IA", "Open Source", "Hardware"]
---

Puedes ejecutar un modelo de lenguaje capaz en hardware que cabe en tu escritorio, y millones de personas ya lo hacen. [Ollama](https://ollama.com), la herramienta que la mayoría instala primero, pasó de unas 100 000 descargas al mes a principios de 2023 a 52 millones a principios de 2026. En Hugging Face, los modelos empaquetados en GGUF, el formato hecho para correr en tu propia máquina, crecieron de un par de cientos a más de 135 000. Esas son curvas de adopción de algo que solía ser un proyecto de fin de semana.

Dos curvas se cruzaron para llegar aquí. La memoria se abarató lo suficiente como para que una caja en tu escritorio sostenga decenas de miles de millones de parámetros, y los modelos se hicieron lo bastante pequeños para caber sin ceder demasiado. La cuantización hizo la mayor parte del achicamiento: guardar cada peso en cuatro bits en lugar de dieciséis reduce el tamaño de un modelo cerca de cuatro veces, y un modelo bien cuantizado conserva casi toda su calidad. Un modelo de 27 mil millones de parámetros como [Qwen3.6](https://huggingface.co/Qwen/Qwen3.6-27B) cabe en 16 a 24 GB una vez cuantizado, la memoria de una sola tarjeta gráfica de consumo.

## Los dos números que lo deciden todo

Que un modelo corra en una máquina se reduce a dos números. El primero es la capacidad de memoria: los pesos tienen que caber, o la máquina no los cargará. El segundo es el ancho de banda de memoria: para generar un token, el hardware lee cada peso activo una vez, así que los tokens por segundo son aproximadamente el ancho de banda dividido entre el tamaño del modelo en memoria. La capacidad decide si corre. El ancho de banda decide qué tan rápido. Cada máquina de aquí es una apuesta distinta sobre esos dos números.

## Memoria unificada frente a GPUs discretas

La división más clara en el hardware doméstico está en dónde vive la memoria. Las máquinas de memoria unificada comparten un gran pozo entre CPU y GPU, así que sostienen modelos enormes pero mueven los datos a velocidad moderada. El Ryzen AI Max de AMD, el chip Strix Halo, mete 128 GB en un mini PC que cuesta entre 1500 y 2000 dólares. Carga un modelo de 70B que no cabe en ninguna GPU de consumo, pero su ancho de banda ronda los 256 GB/s, así que ese 70B denso responde a 4 o 6 tokens por segundo. La DGX Spark de NVIDIA hace el mismo canje a un precio más alto, cerca de 4700 dólares, con 128 GB a 273 GB/s. Ambas sostienen modelos grandes y los corren despacio.

Las GPUs discretas hacen la apuesta opuesta. Una RTX 5090 tiene 32 GB, así que el modelo tiene que ser más chico, pero su ancho de banda es de 1.79 TB/s, y un modelo de 32B cuantizado corre a 45 o 60 tokens por segundo. Una RTX 3090 usada es la versión pragmática de esa apuesta: 24 GB a 936 GB/s por unos cientos de dólares, lo bastante rápida para servir un modelo de 20B a 35B para programar y trabajar con documentos privados, y hay quien apila dos para llegar a 48 GB.

El Mac Studio de Apple con un M3 Ultra consigue ambas cosas, con hasta 512 GB de memoria unificada a 819 GB/s. Esa combinación sostiene modelos que nada más en un escritorio puede. Un modelo DeepSeek de 671 mil millones de parámetros carga y responde a 17 o 18 tokens por segundo, y alcanza esa velocidad porque es un modelo de mezcla de expertos que lee solo unos 37 mil millones de pesos por token. Esos pesos activos, no los 671 mil millones completos, son los que el ancho de banda tiene que mover.

## Hasta laptops, teléfonos y la Pi

La mayor parte de la adopción está por debajo de todo eso. Una laptop gamer con una GPU discreta reciente corre un modelo de 8B más rápido de lo que lees. Las laptops Copilot+ que se venden para IA son más débiles que su marketing: en un Snapdragon X Elite, las herramientas habituales corren en la CPU en lugar de la NPU anunciada, y la memoria compartida a unos 140 GB/s limita un modelo de 8B a 5 o 10 tokens por segundo, donde la 3090 usada corre el mismo modelo cerca de 100. La NPU es real, pero el software que la mayoría usa todavía no la toca.

Más pequeños aún, los dispositivos llegan a todas partes. Una Raspberry Pi 5, de unos 80 dólares, corre un modelo de 2B a 8 o 12 tokens por segundo. Un NVIDIA Jetson Orin Nano corre modelos de 1B a 3B a 30 o 50, suficiente para un robot o una cámara que tiene que responder sin red. El teléfono en tu bolsillo trae un modelo integrado: los Foundation Models en el dispositivo de Apple en los iPhone recientes, Gemini Nano en los Pixel y Galaxy de gama alta, cada uno de unos pocos miles de millones de parámetros. Responden en bastante menos de un segundo, y lo hacen porque nada sale del dispositivo: sin ida y vuelta a un centro de datos, sin esperar por una red. El costo es que son modelos pequeños con presupuestos de memoria ajustados, así que manejan resúmenes, reescritura y clasificación en lugar del razonamiento difícil que le enviarías a un modelo más grande.

El espectro se ordena limpiamente según esos dos números:

| Dispositivo | Memoria | Ancho de banda | Modelo, velocidad con batch 1 | Precio aprox. |
| --- | --- | --- | --- | --- |
| Mac Studio (M3 Ultra) | 512 GB unificada | 819 GB/s | 671B MoE, 17-18 tok/s | ~$9500 |
| DGX Spark | 128 GB unificada | 273 GB/s | 70B, ~3 tok/s | ~$4700 |
| Ryzen AI Max+ 395 (Strix Halo) | 128 GB unificada | ~256 GB/s | 70B, 4-6 tok/s | $1500-2000 |
| RTX 5090 | 32 GB GDDR7 | 1790 GB/s | 32B, 45-60 tok/s | ~$2000 tarjeta |
| RTX 3090 (usada) | 24 GB GDDR6X | 936 GB/s | 8B, ~100 tok/s | ~$700 tarjeta |
| Snapdragon X Elite (Copilot+) | LPDDR5X compartida | ~140 GB/s | 8B, 5-10 tok/s | laptop |
| Jetson Orin Nano | 8 GB compartida | ~102 GB/s | 1-3B, 30-50 tok/s | ~$250 |
| Raspberry Pi 5 | 8 GB compartida | ~17 GB/s | 2B, 8-12 tok/s | ~$80 |
| iPhone / Pixel reciente | compartida | en el dispositivo | ~3B, menos de 1s | gama alta |

Lee la tabla por la columna del ancho de banda y el patrón es el post entero: la capacidad sube a medida que avanzas, el ancho de banda no la sigue, y las máquinas rápidas son las que tienen menos espacio.

## Cómo haces que un modelo quepa y corra

Hacer que el modelo quepa es un problema de software tanto como de hardware, y las herramientas son donde vive buena parte del progreso reciente. La cuantización ahora viene en familias. GGUF corre en CPU, GPU y Apple Silicon, y por eso Ollama y LM Studio se apoyan en él. AWQ y EXL3 le sacan más velocidad a una tarjeta NVIDIA, y MLX hace lo mismo en una Mac. La trampa depende del tamaño: un modelo por encima de 30B pierde menos del dos por ciento de su calidad a cuatro bits, mientras que uno por debajo de 7B puede perder del cinco al diez por ciento y necesita cinco o seis bits para aguantar. Google metió la cuantización en el entrenamiento de Gemma 3 y publicó versiones QAT que se mantienen casi sin pérdida a cuatro bits en hardware de consumo. Modelos como BitNet van más lejos, entrenando con pesos ternarios desde el inicio, aunque nadie ha escalado eso más allá de 8B en público.

El runtime importa tanto como el formato. Ollama y LM Studio son el camino fácil para un usuario; llama.cpp y ExLlamaV3 le dan a un entusiasta más control en una sola GPU; vLLM y SGLang sirven a muchos usuarios a la vez. Cuando un modelo no cabe en la VRAM, estos runtimes vuelcan el resto a la RAM del sistema y corren el excedente en la CPU, canjeando velocidad por la posibilidad de correrlo siquiera. La decodificación especulativa, donde un modelo borrador pequeño adivina tokens que uno más grande verifica, llegó a llama.cpp y MLX este año y compra velocidad real en las máquinas que eran más lentas.

## Dónde los números te engañan

Lee las cifras de rendimiento en internet con sospecha. La mayoría vienen de corridas únicas sobre prompts elegidos a dedo, y los fabricantes citan resultados por lotes que una sola persona frente al teclado nunca ve. Con batch de tamaño uno, la forma en que usas un modelo en tu escritorio, estás limitado por el ancho de banda de memoria y rara vez alcanzas la tasa anunciada. La frontera todavía no cabe: los modelos alojados más grandes son demasiado grandes para cualquiera de este hardware, y para las tareas más difíciles la brecha entre el escritorio y el centro de datos es real. Lo local tampoco es gratis. Pagas por adelantado el hardware y la electricidad, y otra vez en el tiempo que toma configurarlo, cuantizarlo y mantener la cosa funcionando. Lo que compras con eso es control: el modelo corre en tu máquina, tus datos se quedan en ella, y nadie puede limitarte la tasa ni cambiarte el modelo por debajo.

Hace dos años la pregunta era si podías correr un modelo útil en tu propio hardware. Ahora es cuáles de tus problemas son lo bastante pequeños para correr en el hardware que ya tienes, y cómo repartes el trabajo entre el modelo pequeño del teléfono y el más grande de la caja debajo del escritorio. Para más de ellos de los que la mayoría de los equipos supone, la respuesta honesta es que ya caben.
