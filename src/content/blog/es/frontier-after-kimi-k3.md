---
title: "La frontera después de Kimi K3: cuatro puntos de diferencia, el triple de precio"
description: "Los cuatro mejores modelos del índice de Artificial Analysis están a cuatro puntos entre sí y su costo por tarea varía el triple. El más barato es el que puedes descargar. Lo que cambió en julio fue el poder de fijar precios, no la capacidad."
date: 2026-08-05T12:00:00
tags: ["IA", "Open Source", "Hardware"]
---

Moonshot AI publicó los pesos completos de Kimi K3 el 27 de julio. Obtiene 57 en el Artificial Analysis Intelligence Index y cuesta $0.94 por tarea, lo que lo convierte en el más barato de los cuatro modelos más fuertes del mundo y en el único de ellos que puedes descargar. En las dos semanas alrededor de ese lanzamiento, Anthropic publicó un modelo insignia que supera a su mejor anterior por menos dinero, OpenAI recortó el precio de un modelo en 80 por ciento, y Alibaba anunció un modelo de 2.4 billones de parámetros con pesos abiertos por venir.

## Qué dice realmente el índice

La capacidad en la cima se comprimió en una banda estrecha. Cuatro puntos separan al primer lugar del cuarto. El costo por tarea entre esos mismos cuatro modelos varía por un factor de tres.

| Modelo | Laboratorio | Pesos | Intelligence Index | Costo por tarea |
| --- | --- | --- | --- | --- |
| Claude Opus 5 | Anthropic | Cerrados | 61 | $2.03 |
| Claude Fable 5 | Anthropic | Cerrados | 60 | $2.75 |
| GPT-5.6 Sol | OpenAI | Cerrados | 59 | $1.04 |
| Kimi K3 | Moonshot AI | MIT modificada | 57 | $0.94 |
| Claude Opus 4.8 | Anthropic | Cerrados | 56 | $1.80 |
| GPT-5.6 Terra | OpenAI | Cerrados | 55 | $0.55 |
| GPT-5.6 Luna | OpenAI | Cerrados | 51 | $0.21 |

Los puntajes corresponden al máximo esfuerzo de razonamiento, y el costo de Fable 5 se mide con fallback.

Artificial Analysis ubicó a K3 tercero en un primer momento y describió su inteligencia como comparable a Opus 4.8 y GPT-5.5. Claude Opus 5 llegó el 24 de julio con 61 puntos y movió a K3 al cuarto lugar. K3 sigue siendo el modelo de pesos abiertos con el puntaje más alto por un margen amplio, y Artificial Analysis ubica la mediana de los modelos open-weight de tamaño similar en 25.

Lee juntas las dos columnas de la derecha y la comparación interesante no es el primero contra el cuarto. Es Fable 5 con 60 puntos por $2.75 frente a K3 con 57 puntos por $0.94. Tres puntos de inteligencia medida los separan, y uno cuesta casi el triple que el otro.

## Dónde gana y dónde pierde

Un solo número de índice esconde en qué es bueno un modelo. El [informe técnico](https://arxiv.org/abs/2607.24653) de Moonshot publica una comparación sobre unos cuarenta benchmarks, y el patrón que hay dentro es más útil que el puesto.

| Benchmark | Kimi K3 | Claude Fable 5 | GPT-5.6 Sol |
| --- | --- | --- | --- |
| BrowseComp | 91.2 | 88.0 | 90.4 |
| SWE-Marathon | 42.0 | 35.0 | 39.0 |
| ProgramBench | 77.8 | 76.8 | 77.6 |
| Terminal-Bench 2.1 | 88.3 | 88.0 | 88.8 |
| FrontierSWE | 81.2 | 86.6 | 71.3 |
| DeepSWE | 67.5 | 70.0 | 73.0 |
| HLE-Full (sin herramientas) | 43.5 | 53.3 | 44.5 |
| CritPt | 23.4 | 28.6 | 32.3 |

K3 se lleva el mejor puntaje en trabajo agéntico de largo horizonte. Lidera BrowseComp con 91.2, DeepSearchQA con 95.0, MCPMark-Verified con 94.5 y SWE-Marathon con 42.0, siete puntos por encima de Fable 5 en una suite de kernels de GPU. Donde pierde, pierde en razonamiento difícil: 43.5 frente a los 53.3 de Fable 5 en Humanity's Last Exam sin herramientas, y 23.4 frente a los 32.3 de Sol en CritPt. El propio resumen de Moonshot dice que K3 queda detrás de Fable 5 y GPT-5.6 Sol en general y le gana a todos los demás modelos de la suite, lo que coincide con la tabla en lugar de exagerarla.

Dos notas al pie de esa tabla importan tanto como los puntajes. Moonshot registra que todos los resultados de Fable 5 incluyen comportamiento de fallback y que todos los de GPT-5.6 Sol incluyen posibles cyberguards, así que estas son comparaciones de modelo más andamiaje y no de modelo contra modelo. En PostTrainBench, Fable 5 usó fallbacks en 35 por ciento de las tareas. Lee todo esto sabiendo que Moonshot eligió la suite.

## Todos se movieron por precio

Anthropic fue primero. Claude Opus 5 apareció el 24 de julio con 61 puntos, por encima de Fable 5, a $2.03 por tarea, que Artificial Analysis mide como 26 por ciento por debajo del costo de Fable 5. Anthropic publicó un modelo mejor que además es más barato de operar que el que venía vendiendo. La ventaja aparece con el máximo esfuerzo de razonamiento, y en niveles de esfuerzo más bajos Opus 5 queda detrás de la familia GPT-5.6 en la frontera costo-inteligencia.

OpenAI siguió el 30 de julio, tres semanas después de lanzar el modelo al que le cambió el precio. GPT-5.6 Luna bajó de un dólar a veinte centavos por millón de tokens de entrada, y de seis dólares a $1.20 por millón de tokens de salida. Terra bajó 20 por ciento. Sol, el modelo insignia, mantuvo su precio. La cobertura atribuye los recortes al escrutinio de costos de las empresas y a la competencia de los modelos chinos de pesos abiertos.

El mecanismo no depende de qué lanzamiento disparó qué decisión. Cuando un modelo que está a pocos puntos de los líderes se puede descargar y servir por cualquiera, lo máximo que un proveedor cerrado puede cobrar queda acotado por lo que le cuesta a alguien más operar el abierto. Ese techo no existía en este nivel de capacidad hace dieciocho meses. Ambos laboratorios estadounidenses además se preparan para salir a bolsa, así que la compresión de márgenes deja de ser un asunto privado y empieza a aparecer en documentos públicos.

## Alibaba respondió nueve días después

El 3 de agosto, Alibaba publicó Qwen3.8-Max, el primer Qwen de clase Max que sale con pesos abiertos. Tiene 2.4 billones de parámetros con unos 95 mil millones activos por token, lee un millón de tokens de contexto, escribe hasta 128 000, y maneja imágenes y video. La API cuesta $2 por millón de tokens de entrada, $6 por millón de salida y $0.25 en caché. Los pesos se anunciaron para Hugging Face y ModelScope la semana siguiente y no el día del lanzamiento, así que al momento de escribir esto puedes rentarlo pero todavía no descargarlo.

Sus números aterrizan justo debajo de los líderes. Qwen3.8-Max está cuarto en la tabla de programación frontend de Arena, detrás de Claude Opus 5 y Kimi K3. Obtiene 66.1 en el índice de Vals, igualando a Claude Opus 4.7, y 87.3 por ciento en SWE-bench frente a 82.6 de GPT-5.5 y 89.2 de Opus 4.8. Terminal-Bench 2.1 subió a 67.4 desde el 61.0 de Qwen 3.7.

Alibaba también anunció Qwen3.8-27B, un modelo de pesos abiertos más pequeño de la misma familia, apuntado a GPUs comunes en instalaciones propias. Para lo que hacemos nosotros, ese es el más importante de los dos lanzamientos. Construimos este sitio con Qwen3.6-27B en una sola tarjeta de consumo, así que un nuevo 27B en esa línea cambia lo que podemos poner en el hardware del propio cliente, mientras que el modelo insignia de 2.4 billones de parámetros cambia qué factura paga.

## De dónde vino el 2.5x

K3 no es K2 con más parámetros encima. Moonshot reporta una eficiencia de escalamiento unas 2.5 veces mejor que la de K2, medida como pérdida de validación frente a FLOPs de entrenamiento, y lo atribuye a la arquitectura y a las recetas de datos más que al tamaño.

| | Kimi K2 | Kimi K3 |
| --- | --- | --- |
| Parámetros totales | 1.04T | 2.78T |
| Activos por token | 32.6B | 104.2B |
| Capas | 61 | 93 |
| Expertos enrutados | 384 | 896 |
| Expertos activos por token | 8 | 16 |
| Atención | MLA | Híbrida KDA y MLA (69 KDA, 24 MLA) |
| Activación | SwiGLU | SiTU-GLU |
| Contexto de entrenamiento | 128K | 1M |

Dos cambios cargan con la mayor parte. La pila de atención alterna tres capas de Kimi Delta Attention con una capa MLA con compuerta por bloque, así que la atención lineal se encarga de mezclar la secuencia mientras la atención global periódica preserva la interacción completa. Los Attention Residuals dejan además que cada capa recupere representaciones de todas las capas anteriores a través de una pseudo-consulta aprendida, en lugar de leer un solo flujo residual acumulado.

Escalar a 896 expertos también exigió un trabajo de estabilidad que se lee como una lista de cosas que se rompieron. Encadenar las proyecciones de la ruta enrutada a través de casi cuatro multiplicaciones de matrices consecutivas a 2.8 billones de parámetros hacía explotar las activaciones internas, así que Moonshot agregó un RMSNorm antes de la proyección de subida y reemplazó SwiGLU por SiTU-GLU, que acota ambas ramas multiplicativas con un límite suave de tanh. Balancear la carga entre casi mil expertos rompía la regla habitual de actualización de sesgos, así que fijan el sesgo de cada experto a partir de un cuantil de los puntajes del router, estimado a escala con un histograma en lugar de un ordenamiento exacto.

Un detalle más explica el contexto de un millón de tokens. K3 no aplica ninguna codificación posicional a sus capas de atención global y deja que la posición surja de forma implícita del decaimiento recurrente de las capas KDA, así que llega a 1M de tokens sin reescalar RoPE ni interpolar con YaRN. La ventana de contexto creció con un currículo de cuatro etapas, de 8K a 64K durante el pre-entrenamiento y de 256K a 1M durante el enfriamiento.

## Abierto no significa local a este tamaño

Los pesos de K3 ocupan 1.4 terabytes en MXFP4, y unos 5.6 terabytes a dieciséis bits. Todo tiene que estar en memoria rápida antes de que el modelo procese un token, así que cargarlo requiere unas dieciocho H100 de 80 GB cada una, o un nodo moderno con ocho tarjetas Blackwell de 192 GB. Qwen3.8-Max necesita más de un terabyte para cargarse y un mínimo de ocho aceleradores H100 o B200.

| Modelo | Tamaño de los pesos | Qué se necesita para cargarlo |
| --- | --- | --- |
| Kimi K3 (MXFP4) | 1.4 TB | ~18 × H100 de 80 GB, u 8 × Blackwell de 192 GB en un nodo |
| Kimi K3 (BF16) | ~5.6 TB | más allá de un nodo estándar |
| Qwen3.8-Max | más de 1 TB | 8 × H100 o B200 como mínimo |
| Qwen3.8-27B | cabe en una tarjeta cuantizado | consumo o servidor de una sola GPU |

La restricción que manda es la capacidad y el ancho de banda de memoria, no la aritmética. Ambos modelos son mezclas dispersas de expertos, así que K3 corre 104.2 mil millones de sus 2.78 billones de parámetros por token y Qwen3.8-Max unos 95 mil millones de sus 2.4 billones. El cómputo por token sigue siendo accesible mientras el requisito de memoria se niega a moverse.

Hay un detalle de despliegue que es fácil pasar por alto. Esos pesos MXFP4 no son una copia comprimida de un modelo de dieciséis bits. Moonshot hizo entrenamiento consciente de la cuantización durante toda la etapa de post-entrenamiento, manteniendo los pesos de los expertos en MXFP4 y las activaciones en MXFP8, mientras las proyecciones de atención, los expertos compartidos y los routers se quedaron en mayor precisión. Durante el aprendizaje por refuerzo, el rollout y el entrenamiento compartieron el mismo esquema de cuantización, lo que elimina el desajuste entre entrenamiento e inferencia que suele aparecer cuando un modelo se cuantiza después. El artefacto de cuatro bits es el modelo entrenado y no una versión con pérdida de él.

Compara eso con [lo que cabe en un escritorio](/es/blog/state-of-local-models). La mayor cantidad de memoria en una sola máquina de escritorio hoy son 512 GB en un Mac Studio, y esa máquina corre un modelo de 671 mil millones de parámetros a 17 o 18 tokens por segundo. K3 necesita casi el triple de esa capacidad. Descargar estos pesos te compra el derecho de elegir quién los aloja, no la posibilidad de correr el modelo en tu oficina, y por eso Together AI y Modal tenían acceso alojado disponible desde el día cero.

Así que los dos extremos de la misma quincena apuntan en direcciones opuestas. Un modelo de 2.8 billones de parámetros se volvió gratuito y siguió fuera de alcance, y llegó un modelo de 27B que un cliente puede correr en hardware que ya tiene. Para la mayor parte del trabajo que entregamos, clasificación y extracción y enrutamiento y redacción, el modelo pequeño en su propia tarjeta sigue siendo la respuesta, y la capacidad de escala de frontera se renta con la opción de moverla.

## El resultado de seguridad que nadie puede comparar

La afirmación más importante del informe está en la sección de evaluación y no en el resumen. Moonshot apuntó a K3 contra bases de código reales para encontrar vulnerabilidades, cubriendo kernels de sistemas operativos, bases de datos, frameworks web, blockchain y software de VPN, y produjo cientos de hallazgos candidatos. De los que pasaron por revisión humana, alrededor de 70 por ciento se confirmaron como genuinos, incluyendo 16 vulnerabilidades previamente desconocidas en seis proyectos.

Dos están en el kernel de Linux. Una es una escritura fuera de límites en el heap, activable de forma remota, introducida por una corrección upstream incompleta y presente en todas las versiones posteriores hasta el código upstream actual, que expertos en seguridad confirmaron como una primitiva de denegación de servicio remota. La otra es un error de la clase Dirty-COW en el subsistema RDMA, donde una corrección anterior había eliminado una verificación de permisos, lo que da una primitiva determinista de escalada de privilegios local.

Moonshot no pudo comparar nada de esto con los modelos de Anthropic o de OpenAI. El informe dice que los modelos de frontera de ambos laboratorios rechazan tareas relacionadas con ciberseguridad, lo que vuelve inviable una evaluación comparable, así que los excluye de la suite y usa GLM-5.2 como base para el desarrollo de exploits.

Eso convierte el argumento de la [carta de los open weights](/es/blog/open-weights-letter) de una predicción en una medición. La carta sostenía que quien defiende necesita modelos con capacidades comparables a las de quien ataca. Aquí los modelos que de hecho harán el trabajo son los descargables, y el rechazo que vuelve a los modelos cerrados más seguros de vender es el mismo rechazo que los deja fuera de la comparación. Que eso te tranquilice depende por completo de a qué lado de la descarga estés.

## Qué admiten los laboratorios

Moonshot publicó su propia lista de modos de falla, que es la parte más útil de su informe. K3 es sensible al historial de razonamiento y necesita harnesses verificados contra él. Es excesivamente proactivo, es decir, decide por su cuenta cuando un pedido es ambiguo. Y Moonshot afirma que hay una diferencia notoria en experiencia de usuario frente a Claude Fable 5 y GPT 5.6 Sol. Estar cerca de la cima de un índice y resultar peor para trabajar son dos cosas ciertas a la vez, y la segunda decide si un desarrollador lo sigue usando en la segunda semana.

El mismo informe contiene un resultado que apunta en la dirección contraria. En el benchmark interno de desarrollo web de Moonshot, jueces expertos compararon K3 contra Claude Opus 4.8 a ciegas, sin saber qué modelo produjo cada salida, y prefirieron a K3 en 58.6 por ciento de los prompts frente a 27.6 por ciento, un margen de 31 puntos que se amplía a 59 puntos en trabajo de 3D y shaders. Su métrica de experiencia de programación pone a K3 apenas por delante de Fable 5 aunque sus puntajes crudos de tarea queden detrás. Así que la brecha de experiencia de usuario que Moonshot admite es real y más angosta de lo que sugiere la admisión, según lo que construyas.

La cifra de bajo costo por tarea también merece una advertencia. Artificial Analysis registró 130 millones de tokens de salida de K3 en todo el Intelligence Index, más del doble de la mediana de 63 millones de los modelos de razonamiento comparables. K3 termina siendo más barato por tarea porque su precio por token es bajo, y esa aritmética puede invertirse en una carga de trabajo pesada en salida. Mide tus propias tareas antes de confiar en el promedio.

Ninguno de los dos lanzamientos es código abierto. Moonshot publicó los pesos y se guardó los datos y el código de entrenamiento, bajo una licencia MIT modificada y no MIT. Qwen3.8-Max generó preguntas inmediatas sobre si su licencia restringe el uso en Estados Unidos, la Unión Europea, el Reino Unido y Corea, y el anuncio de Alibaba no las respondió. Si estás considerando cualquiera de los dos modelos para un producto, la licencia es el documento que hay que leer primero, antes de la tabla de benchmarks.

Para un equipo que elige un modelo en agosto de 2026, la capacidad dejó de ser la pregunta que separa las opciones. Cuatro laboratorios te venderán algo que está a cuatro puntos del mejor, dos de ellos te entregarán el archivo, y lo que queda es cuánto cuesta una tarea, quién opera la memoria y si puedes irte. El trabajo de ingeniería se movió en consecuencia, hacia sistemas que puedan cambiar el modelo por debajo sin que la aplicación se dé cuenta.
