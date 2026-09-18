---
title: "Bonsai 2: un modelo de 27B en 5.9 GB, y la memoria que no ahorra"
description: "PrismML comprimió Qwen3.8-27B a pesos ternarios y conservó el 98.2% de su promedio de benchmarks según su propia medición. Los pesos se encogieron nueve veces. La caché KV no se movió, y la capacidad que más se degradó es aquella sobre la que construimos."
date: 2026-09-18T12:00:00
tags: ["IA", "Open Source", "Hardware"]
---

PrismML publicó [Ternary Bonsai 2 27B](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf) el 17 de septiembre bajo licencia Apache 2.0. Es Qwen3.8-27B con cada peso colapsado a uno de tres valores, y ocupa 5.93 GB donde el original toma 53.80 GB. En la propia suite de veinte benchmarks de PrismML promedia 83.9 frente al 85.4 del modelo padre.

Hace tres semanas escribimos que la calidad [se cae con fuerza por debajo de cuatro bits](/es/blog/qwen38-27b-local). Este modelo corre a 1.76 bits por peso. La afirmación merece una mirada cuidadosa, y la parte interesante no resulta ser ni la tasa de compresión ni el porcentaje de retención.

## Qué significa ternario en este archivo

Cada peso se vuelve uno de {−1, 0, +1}, y cada grupo de 128 pesos comparte un factor de escala en FP16. Un valor ternario carga log2(3), alrededor de 1.585 bits, y las escalas amortizadas llevan el costo real a cerca de 1.76. Casi nada se escapa: solo 26.2 millones de parámetros, menos de una décima de punto porcentual, se quedan en mayor precisión, y son las rutas de estado recurrente y los pesos de normalización.

Antes de asignar los trits, PrismML aplica una rotación de Hadamard por bloques con tamaño de bloque 1024, y el runtime aplica la transformación correspondiente a las activaciones antes de cada multiplicación. La rotación reparte los pesos atípicos a lo largo de un bloque para que ninguna coordenada tenga que representarse con un valor que el formato no puede expresar. El whitepaper de PrismML le atribuye la idea a SpinQuant.

| Formato | Bits por peso | Tamaño |
| --- | --- | --- |
| Referencia FP16 | 16.0 | 53.80 GB |
| UD-Q4_K_XL | ~4.5 | 17.6 GB |
| PQ2_0 (ranuras de 2 bits) | 2.13 | 7.25 GB |
| PTQ1_0 (trits densos) | 1.76 | 5.93 GB |

Los dos empaquetados canjean espacio por aritmética. PTQ1_0 empaqueta los trits de forma densa y cuesta más desempaquetarlo, así que solo gana cuando la memoria es la restricción que manda. PQ2_0 desperdicia algo de espacio para que el desempaquetado salga barato. La torre de visión se distribuye aparte como un archivo de 0.63 GB y se carga solo cuando le das una imagen al modelo.

El cero es lo que hace que lo ternario funcione y no lo binario. Bajo una distribución de pesos aproximadamente gaussiana cerca del 31 por ciento de los pesos cae en cero, y el análisis publicado de formatos ternarios ubica el error de reconstrucción cerca de 0.263 sigma al cuadrado frente a 0.363 de una codificación de solo signo. Ese tercer estado vale alrededor de cinco puntos de capacidad retenida. Nada de eso es una perturbación pequeña: el error cuadrático medio queda cerca de la mitad de la magnitud cuadrática media de los pesos, y el modelo funciona igual.

## Comprimido a ternario, no entrenado en ternario

La tarjeta del modelo describe los pesos como nativamente ternarios y no post-cuantizados, lo cual es cierto en un sentido estrecho y engañoso en uno más amplio. Los pesos se almacenan y se multiplican como trits en lugar de descuantizarse a punto flotante en tiempo de ejecución. Aun así se produjeron comprimiendo un modelo FP16 ya terminado y no pre-entrenando en ternario desde el inicio.

Esa distinción tiene registro público. BitNet b1.58 2B4T de Microsoft, publicado en abril de 2025, se entrenó nativamente en ternario desde cero con 2400 millones de parámetros sobre 4 billones de tokens, y sigue siendo la referencia del enfoque desde cero. Cuando escribimos en julio que [nadie había escalado el entrenamiento ternario desde cero más allá de 8B en público](/es/blog/state-of-local-models), era exacto y lo sigue siendo. Lo que llegó desde entonces es la otra ruta: tomar un modelo que alguien más entrenó a precisión completa y comprimirlo lo suficiente como para que el resultado se comporte como un modelo ternario.

PrismML no ha revelado cómo asigna los valores ternarios. La empresa publica repositorios de inferencia y de demostración, y ningún código de entrenamiento, así que el pipeline que produjo estos pesos no es reproducible desde afuera. Varios artículos llenan el vacío explicando BitNet Distillation de Microsoft, un procedimiento documentado de tres etapas que reemplaza las capas lineales, hace un calentamiento y luego destila de un maestro sobre logits y relaciones de atención. Eso es una conjetura razonable sobre la forma del problema y no es una descripción de lo que hizo PrismML.

## Dónde se nota la compresión

La tabla por categorías de PrismML informa más que su titular.

| Categoría | Qwen3.8-27B FP16 | Ternary Bonsai 2 | Retención |
| --- | --- | --- | --- |
| Matemática | 97.06 | 96.57 | 99.5% |
| Programación | 82.17 | 81.58 | 99.3% |
| Seguimiento de instrucciones | 81.25 | 82.66 | 101.7% |
| Agéntico y llamadas a herramientas | 79.74 | 77.57 | 97.3% |
| Conocimiento y razonamiento | 86.66 | 83.95 | 96.9% |
| Visión | 81.64 | 78.59 | 96.3% |
| General | 85.4 | 83.9 | 98.2% |

Matemática y programación sobreviven casi intactas, que es el resultado sorprendente y el que vale tomar en serio. En AIME26 el modelo comprimido obtiene 95.83 frente al 94.58 del padre, y en LiveCodeBench los dos quedan parejos con 90.07 y 90.05. La cuantización de bajo bit convencional no se comporta así. La misma tarjeta reporta que IQ2_XXS, con 9.4 GB, saca 78.6 en AIME26 y 70.05 en LiveCodeBench, así que un tamaño comparable alcanzado por medios ordinarios pierde mucho más.

Una fila debería volverte desconfiado del agregado. El seguimiento de instrucciones mejora bajo compresión, hasta 101.7 por ciento de retención. Una transformación con pérdida de un modelo no lo vuelve mejor siguiendo instrucciones, así que ese número es ruido de medición promediándose dentro de un titular, e infla el 98.2 por ciento.

El número que importa para nuestro trabajo no está en esa tabla. El propio resultado de PrismML en Terminal-Bench 2.1 es 52.8 frente al 69.7 del padre, cerca de 75 por ciento de retención. Su categoría agéntica dice 97.3 por ciento. Ambos son suyos, y la brecha entre los dos es la diferencia entre emitir una llamada a herramienta bien formada y terminar una tarea larga. Las suites de llamadas a funciones miden lo primero. Terminal-Bench mide lo segundo. La compresión cuesta cerca de un cuarto de lo segundo mientras apenas toca lo primero.

Dos advertencias más van al lado de esos números. Todos los resultados aquí son de PrismML y nadie los ha reproducido de forma independiente. Y los propios documentos del fabricante no coinciden entre sí: la tarjeta del modelo reporta un promedio de 84.78 frente a una línea base de 86.32, mientras el anuncio reporta 83.9 frente a 85.4, y ambos llegan a 98.2 por ciento de retención.

La única medición agéntica de terceros de esta familia cubre la generación anterior. Una corrida de la comunidad pasó al Ternary Bonsai 27B de julio por Terminal-Bench 2.0 en una GPU de laptop de 8 GB y registró 7.9 por ciento, por debajo de un modelo de 9B con cuantización convencional de cuatro bits que cabía en la misma tarjeta. Ese era otro modelo y un harness que este lanzamiento dice manejar mejor. También es la única evidencia agéntica independiente que existe para cualquier Bonsai, y nadie ha publicado una corrida comparable para Bonsai 2.

## La memoria que no ahorra

Aquí está la parte que la cobertura pasa por alto, y se deduce directamente de la aritmética de nuestro post anterior.

La compresión aplica a los pesos. No aplica a la caché KV. Esta arquitectura gasta unos 64 KB por token de contexto, y esa cifra es una propiedad de las capas de atención, que Bonsai 2 hereda de Qwen3.8-27B sin cambios.

| Contexto | Caché KV | Total con Bonsai 2 | Total con pesos Q4 |
| --- | --- | --- | --- |
| 8K | ~0.5 GB | ~6.4 GB | ~18.1 GB |
| 32K | ~2 GB | ~7.9 GB | ~19.6 GB |
| 128K | ~8 GB | ~13.9 GB | ~25.6 GB |
| 262K (nativo) | ~16 GB | ~21.9 GB | ~33.6 GB |

Lee la primera columna contra la segunda. Con el contexto nativo del modelo la caché es casi el triple del tamaño de los pesos, y el total sigue necesitando una tarjeta de 24 GB, que es el mismo piso que describimos para pesos de cuatro bits con contexto corto. Unos pesos nueve veces más chicos compraron muchísimo en 8K y casi nada en 262K.

Así que el cuello de botella se movió en lugar de desaparecer. Antes de esto, la memoria estaba dominada por una constante que podías comprimir. Ahora está dominada por un término que crece con cuánto contexto necesita la tarea, y el trabajo agéntico de largo horizonte es justamente el que llena una ventana de contexto. La idea de un modelo de 27B en una laptop o en un teléfono es real para prompts cortos y acotados. No sobrevive a la carga de trabajo que anuncian sus propios puntajes agénticos.

En una tarjeta de 8 GB los pesos entran con unos dos gigabytes de sobra, lo que compra unos 32K de contexto de trabajo. Eso es un asistente usable y un agente pobre.

## Qué hace falta para correrlo

llama.cpp estándar no puede cargar estos archivos. PrismML distribuye un fork, y usar el modelo significa usarlo, lo que es un impuesto de adopción real para quien ya tiene un stack local armado y la razón por la que el camino de un solo comando estilo Ollama todavía no aplica aquí.

El rendimiento es bueno donde se midió: 142.5 tokens por segundo en una RTX 5090, 96.7 en una 4090 y 46.8 en un M5 Max. PrismML reporta 0.714 mWh por token en una 4090 y afirma que eso es 40 por ciento mejor que un modelo de 8B en precisión completa, que es el tipo de comparación que favorece al numerador eligiendo el denominador.

La licencia es Apache 2.0, heredada del padre, y no es un detalle menor. Un derivado comprimido bajo una licencia permisiva es algo que la revisión de un cliente puede aprobar sin una negociación.

Para nuestro propio trabajo la ubicación honesta es estrecha y real. Donde una tarea está acotada, el contexto se mantiene corto y el trabajo es matemática o código, este modelo pone capacidad en hardware que no tenía ninguna. Donde la tarea se alarga, la compresión se lleva un cuarto de la capacidad que importa y el contexto se lleva la memoria que la compresión ahorró. El número que hay que mirar en el próximo lanzamiento no es el tamaño. Es Terminal-Bench.
