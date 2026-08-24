---
title: "Qwen3.8-27B: la misma arquitectura, catorce puntos mejor"
description: "Alibaba publicó en agosto un modelo de 27B que obtiene 52 en el índice de Artificial Analysis frente a los 38 de su antecesor, con una red idéntica. Qué significa eso para correr un modelo capaz en una sola tarjeta gráfica, y cuánto cuesta en memoria y en tokens."
date: 2026-08-24T12:00:00
tags: ["IA", "Open Source", "Hardware"]
---

Alibaba publicó [Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) el 14 de agosto bajo licencia Apache 2.0. La red es la misma que lanzó en abril: 27 mil millones de parámetros densos, 64 capas, la misma combinación de Gated DeltaNet con atención con compuerta, el mismo contexto de 262 144 tokens, el mismo codificador de visión. En el índice de inteligencia de Artificial Analysis obtiene 52 donde Qwen3.6-27B obtuvo 38. Nada de la arquitectura cambió, y el modelo mejoró catorce puntos.

## La mejora viene entera del post-entrenamiento

Alibaba atribuye la ganancia a entornos de aprendizaje por refuerzo y a destilación on-policy. Mismo número de parámetros, misma forma, mejor entrenamiento.

| | Qwen3.6-27B | Qwen3.8-27B |
| --- | --- | --- |
| Parámetros | 27B densos | 27B densos |
| Capas | 64 | 64 |
| Atención | Gated DeltaNet con atención con compuerta | sin cambios |
| Contexto nativo | 262 144 | 262 144 |
| Codificador de visión | sí | sin cambios |
| Licencia | Apache 2.0 | Apache 2.0 |
| Índice de Artificial Analysis | 38 | 52 |
| Terminal Bench 2.1 | 63.4 | 73.0 |
| SWE-bench Pro | 53.5 | 61.7 |
| DeepSWE 1.1 | 13.3 | 42.2 |

Todo lo que está sobre la línea es idéntico y todo lo que está debajo se movió. DeepSWE pasó de 13.3 a 42.2, que es menos un refinamiento que un modelo que antes no podía hacer la tarea aprendiendo a hacerla.

Es la misma lección que [reportó Moonshot](/es/blog/frontier-after-kimi-k3) desde el otro extremo de la escala, donde la arquitectura y las recetas de entrenamiento compraron 2.5 veces más eficiencia de escalamiento en lugar de tamaño puro. La capacidad con un número fijo de parámetros está lejos de agotarse. Para quien planea hardware alrededor de un modelo, eso importa más que la tabla de benchmarks: el 27B para el que compras una tarjeta este año va a mejorar sin que compres otra tarjeta.

## Por qué cambiar solo el entrenamiento mueve tanto el número

El post-entrenamiento no es una sola técnica, y la literatura separa sus partes según en qué estados se corrige al modelo. El ajuste supervisado aplica su función de pérdida a trayectorias fijas de un conjunto de datos. El aprendizaje por refuerzo con recompensas verificables aplica una señal escasa de resultado a trayectorias que el modelo generó por su cuenta. La destilación on-policy aplica retroalimentación densa a nivel de token sobre esas mismas trayectorias autogeneradas, con un maestro que puntúa cada token en el contexto que el estudiante produjo de verdad. Un [survey de destilación on-policy de 2026](https://arxiv.org/abs/2606.22793) organiza los tres enfoques por distribución de estados y no solo por función de pérdida, y ese encuadre explica cómo una arquitectura congelada gana catorce puntos. La red es la misma. Las situaciones en las que se la corrige, no.

El argumento de eficiencia del lado de la destilación es la densidad de información. El aprendizaje por refuerzo entrega aproximadamente un bit de señal por episodio, porque el modelo solo aprende si la respuesta final pasó. La destilación entrega una señal en cada token, así que un solo rollout carga órdenes de magnitud más supervisión. [Thinking Machines Lab](https://thinkingmachines.ai/blog/on-policy-distillation/) midió lo que eso compra en AIME'24 con un estudiante Qwen3-8B y un maestro Qwen3-32B.

| Método | AIME'24 | Horas de GPU |
| --- | --- | --- |
| Destilación off-policy (SFT, 400K muestras) | 60% | no reportado |
| Aprendizaje por refuerzo | 68% | 17 920 |
| Destilación on-policy | 70% | 1800 |

Diez veces menos cómputo por un mejor puntaje. Alibaba publicó la misma proporción en el [informe técnico de Qwen3](https://arxiv.org/abs/2505.09388), donde la destilación superó a su pipeline de RL de cuatro etapas con cerca de una décima parte de las horas de GPU, 1800 contra 18 000 en el modelo de 8B. Esa es la razón comercial por la que un laboratorio publica un segundo modelo sobre una arquitectura sin cambios. El eje de mejora más barato que queda no son los parámetros ni los datos de pre-entrenamiento, sino cuáles trayectorias puntúas y con qué densidad las puntúas.

La KL inversa es el objetivo habitual del lado de la destilación, y vale explicar por qué. Poner la expectativa bajo la propia distribución del estudiante hace que sus rollouts coincidan con el objetivo, y el comportamiento que busca modas evita que el estudiante reparta masa de probabilidad en regiones que el maestro considera improbables. La teoría reciente reformula todo el procedimiento como aprendizaje por refuerzo denso con restricción de KL, donde el log-ratio por token del maestro actúa como una recompensa implícita, y muestra que escalar esa recompensa más allá de su peso habitual puede empujar al estudiante más allá de su propio maestro.

## Qué no demuestran los catorce puntos

Aquí la investigación se vuelve contra el marketing, y el argumento importa porque cambia cómo se lee cualquier número de post-entrenamiento.

Un [resultado muy citado de 2025](https://arxiv.org/abs/2504.13837) encontró que los modelos entrenados con RLVR le ganan a sus modelos base con presupuestos pequeños de muestreo, mientras el modelo base los igualaba o superaba con k grande. Bajo esa lectura, el aprendizaje por refuerzo afila una distribución que el modelo base ya contenía en lugar de agregar razonamiento nuevo. Un [artículo de julio de 2026](https://arxiv.org/abs/2607.20543) le puso nombre a la forma aguda de esta inversión de pass@k y la diagnosticó en un estudio de 3000 prompts sobre tres semillas: las trayectorias correctas que existen de forma rara en el modelo base son demasiado escasas para aparecer en un grupo finito de rollouts, así que desaparecen antes de que alguna recompensa pueda reforzarlas. La política entrenada termina resolviendo menos problemas distintos que el modelo del que partió, mientras puntúa mejor en cada intento individual.

La pregunta no está cerrada. Un [enfoque con currículo](https://arxiv.org/abs/2606.22317) reportó ganancias de 9.8 puntos en pass@256 sobre los modelos base y de 10.3 sobre el RLVR común, que es una frontera moviéndose hacia afuera en lugar de estrechándose. [Trabajo sobre modelos de visión y lenguaje](https://arxiv.org/abs/2511.00710) encontró que RLVR resolvía problemas donde el base sacaba cero con cualquier presupuesto de muestreo probado. Y la mitad de destilación tira en dirección contraria al resultado de RL: Alibaba reportó mejoras en pass@64 con destilación desde los logits del maestro y lo describió como una expansión del espacio de exploración del estudiante.

Ahora aplica eso al número que abre este artículo. El índice de Artificial Analysis es una medición de un solo intento, así que catorce puntos significan que Qwen3.8-27B tiene bastante más probabilidad de acertar en el primer intento. Si puede llegar a soluciones que su antecesor no alcanzaba con cien intentos es otra pregunta, y nadie fuera de Alibaba publicó curvas de pass@k para ninguno de los dos modelos. Para trabajo agéntico el número de un solo intento suele ser el que decide, porque un agente que necesita cien muestras para encontrar la corrección no está haciendo el trabajo. Para búsqueda estilo investigación, donde puedes permitirte muestrear ampliamente, la distinción es real y aquí no está medida.

## Dónde queda de verdad frente a la frontera

La mayor parte de la cobertura presenta a este modelo como si se acercara a Claude Opus. Lee con cuidado la comparación del propio fabricante y el modelo de referencia es Claude Opus 4.6, que no es la frontera actual. Alibaba reporta 61.7 en SWE-bench Pro frente a los 53.4 de Opus 4.6, y también reporta perder en Terminal Bench 2.1 (73.0 contra 78.2), en GPQA Diamond (89.2 contra 91.3) y en Humanity's Last Exam (30.8 contra 40.0). Elegir contra qué modelo te miden ya es una afirmación.

El índice independiente lo ubica en un lugar más útil.

| Modelo | Pesos | Índice | Costo por tarea | Qué se necesita para correrlo |
| --- | --- | --- | --- | --- |
| Claude Opus 5 | Cerrados | 61 | $2.03 | API alojada |
| Claude Fable 5 | Cerrados | 60 | $2.75 | API alojada |
| GPT-5.6 Sol | Cerrados | 59 | $1.04 | API alojada |
| Kimi K3 | MIT modificada | 57 | $0.94 | 1.4 TB de memoria rápida |
| GPT-5.6 Terra | Cerrados | 55 | $0.55 | API alojada |
| Qwen3.8-27B | Apache 2.0 | 52 | nada por token | una GPU de 24 GB |
| GPT-5.6 Luna | Cerrados | 51 | $0.21 | API alojada |

Nueve puntos separan a este modelo del mejor sistema que se puede rentar. Queda un punto por encima de GPT-5.6 Luna, el modelo más barato de la familia actual de OpenAI, y tres por debajo de Terra. Así que la descripción honesta no es que se acerque a la frontera. Alcanza el escalón más bajo de la escalera de la frontera, y lo hace en hardware que cuesta menos que un mes de uso intenso de Opus 5.

La fila que vale mirar con atención es la de Kimi K3. Cinco puntos mejor, y necesita 1.4 terabytes de memoria residente antes de responder cualquier cosa. Qwen3.8-27B cede esos cinco puntos y cabe en 17 GB. Para un cliente que quiere un modelo dentro de su propia red, ese canje no está ni cerca de ser difícil.

## Frente a los modelos que de verdad correrías

La competencia real no es Opus. Es lo que más quepa en la misma tarjeta.

| | Qwen3.8-27B | Qwen3.6-27B | Gemma 4 31B |
| --- | --- | --- | --- |
| Parámetros | 27B densos | 27B densos | 31B |
| Licencia | Apache 2.0 | Apache 2.0 | Términos de uso de Gemma |
| Contexto nativo | 262K | 262K | 256K |
| Decodificación, una RTX 4090 en Q4_K_M | ~49 tok/s | ~49 tok/s | ~45 tok/s |
| Dónde lidera | programación agéntica, uso de computadora | superado | llamadas estructuradas a herramientas, matemática, idiomas |

Una prueba física del 16 de agosto ubicó al build Q4_K_M de Qwen3.8-27B en unos 49 tokens por segundo en una sola RTX 4090, igualando la velocidad de decodificación y la curva de memoria de su antecesor mientras completaba las doce tareas de programación de la suite en la primera semilla. Gemma 4 31B decodifica alrededor de 8 por ciento más lento en la misma clase de tarjeta.

Gemma 4 no queda vencido en todo. Obtuvo un 90 de 90 limpio en llamadas estructuradas simples a herramientas y un 30 de 30 en corridas de varios pasos, y ganó por un punto una rúbrica de escritura evaluada a ciegas. Si tu carga de trabajo es confiabilidad en el uso de herramientas, cobertura multilingüe o entrada de audio, ese es el modelo que hay que probar primero. Qwen3.8-27B gana en programación agéntica y uso de computadora, donde reporta 84.3 en OSWorld-Verified y 81.9 en AndroidWorld.

## Cuánto cuesta en memoria, con honestidad

Que los pesos quepan en tu tarjeta es la mitad fácil. La cuantización ofrece una escalera limpia.

| Precisión | Pesos en memoria |
| --- | --- |
| 1 bit | 7 a 8 GB |
| 3 bits | 12 a 14 GB |
| 4 bits | 16 a 19 GB |
| 6 bits | 23 a 26 GB |
| 8 bits | 31 GB |
| BF16 | 56 GB |

Después llega el contexto. Esta arquitectura gasta unos 64 KB por token de caché KV, así que 32K de contexto cuestan unos 2 GB, 128K cuestan 8 GB, y los 262 144 tokens nativos completos cuestan cerca de 16 GB por su cuenta. Súmale eso a los 17 o 18 GB de pesos en cuatro bits y la ventana de contexto anunciada no cabe en la tarjeta donde sí caben los pesos. Una GPU de 24 GB es el piso práctico y te da decenas de miles de tokens de contexto de trabajo. 32 GB es cómodo. 48 GB es donde la ventana completa deja de ser teórica.

Dos cosas más moderan los números. Las pruebas de la comunidad encontraron que la calidad cae con fuerza por debajo de cuatro bits, así que los escalones de 1 y 2 bits son demostraciones y no despliegues. Y este modelo es hambriento de tokens: mediciones independientes lo ubican en aproximadamente el doble de tokens por tarea que Qwen3.6-27B y 2.3 veces los de GPT-5.6 Luna Max, con configuraciones de razonamiento por defecto capaces de gastar veinte mil tokens de razonamiento en una sola pregunta. A 49 tokens por segundo esa aritmética no perdona, y en Apple silicon se pone peor, con reportes de menos de diez tokens por segundo en un MacBook Air M4 de 24 GB y de 5 a 6 en un Mac Mini de 32 GB cuando ya hay unos miles de tokens en juego.

La medida que importa es el tiempo de reloj por tarea completada y no los tokens por segundo, y sobre esa base los tokens extra suelen valer la pena, porque el modelo termina trabajo que su antecesor no lograba. Decídelo con tus propias tareas. Pon `reasoning_effort` en bajo o medio para todo lo que no necesite la deliberación, porque ese parámetro existe justamente porque el valor por defecto es caro.

## Adopción, y cómo leer los números

Las herramientas llegaron más rápido que el análisis. Unsloth publicó una escalera completa de cuantizaciones GGUF con el proyector de visión el mismo día del lanzamiento, también bajo Apache 2.0. El modelo entró a la biblioteca de Ollama esa misma semana como `qwen3.8:27b` con un Q4_K_M de 18 GB por defecto. Después vinieron los builds abliterados de la comunidad. Fue tendencia número uno en Hugging Face de inmediato.

Trata las cifras de descargas con sospecha. Los números reportados para esa misma primera semana van desde unas 92 000 en el primer día hasta un millón en veinticuatro horas y tres millones en tres días, que es un orden de magnitud de desacuerdo y te dice que esas cifras se están repitiendo más que midiendo. La señal defendible son las herramientas, más la referencia de que Qwen3.6-27B pasó los 7 millones de descargas en los cuatro meses posteriores a su lanzamiento.

La licencia es la parte que va a decidir la adopción a largo plazo, y es la ventaja silenciosa de este modelo. Apache 2.0 sin restricciones de campo de uso es una propuesta distinta de la MIT modificada de Kimi K3, y de las preguntas todavía abiertas sobre si los términos de Qwen3.8-Max restringen el uso en Estados Unidos y Europa. Una licencia permisiva en un modelo que cabe en una tarjeta es lo que lo vuelve viable dentro de la revisión de cumplimiento de un cliente, que suele ser donde estas conversaciones terminan y no donde empiezan.

Construimos este sitio con [Qwen3.6-27B](/es/blog/open-source-llm-website) en una sola tarjeta de consumo. El reemplazo tiene el mismo tamaño, corre a la misma velocidad, necesita el mismo hardware y es medible mejor en el trabajo. Eso es lo más útil que tiene. La frontera también se movió, y se movió a un lugar al que no puedes seguirla sin un centro de datos, mientras este escalón de la escalera se movió a un lugar al que llegas descargando un archivo nuevo.
