---
title: "Jev garantiza la forma de una respuesta, no la respuesta"
description: "Jev, de TypeSafe AI, se volvió viral con la promesa de que no puede alucinar y con números de 193x más rápido y 445x más barato. La garantía es real y mucho más estrecha de lo que se reportó, los números salen de las evaluaciones de la propia empresa, y TypeSafe es más cuidadosa con ambas cosas que quienes la citan."
date: 2026-09-28T12:00:00
tags: ["IA", "Ingeniería"]
---

TypeSafe AI lanzó Jev en acceso anticipado el 15 de septiembre con un titular de 193.6x más rápido y 444.6x más barato que los modelos de lenguaje de frontera, y con la promesa de que no puede alucinar. En cuestión de días estaba en X, en los canales de Slack de quienes construyen agentes y en un titular de Tom's Hardware. Un artículo muy compartido lo llamó el momento en que un clasificador se convirtió en el nuevo momento ChatGPT.

Jev parece un producto decente. Casi toda afirmación que circula sobre él es más estrecha de lo que se dice o está medida contra algo que no la sostiene, y el documento más cuidadoso de toda la discusión es el propio post de lanzamiento de TypeSafe, al que la cobertura le quitó casi todas las advertencias.

## Qué cubre en realidad la garantía

Jev toma un estado y una pregunta tipada, y devuelve un booleano, una opción de un conjunto declarado o un puntaje, con una confianza asociada. Como el conjunto de salidas posibles queda fijo antes de que la llamada se ejecute, el modelo no puede devolver un valor para el que tu código no tiene una rama. TypeSafe describe esto como matemáticamente imposible de violar y reporta una tasa de errores de tipo del 0 por ciento.

Esa parte es cierta y vale la pena tenerla. También es una afirmación sobre la forma de la salida y no sobre el contenido de la respuesta. Si declaras las categorías Facturación, Técnico y Legal, Jev no puede inventar una cuarta. Sí puede devolver Legal cuando la respuesta correcta era Facturación, y esa respuesta va a pasar el chequeo de tipos, se va a parsear sin problemas y va a llegar con un puntaje de confianza. Una respuesta equivocada en un formato válido sigue siendo equivocada, y el modo de falla que los equipos de software sufren de verdad es la decisión de enrutamiento incorrecta y no la cadena que no se puede parsear.

La palabra alucinación es la que hace el daño. En la literatura de modelos de lenguaje significa contenido fabricado. Aplicada a un clasificador se reduce a la afirmación mucho más pequeña de que las salidas se ajustan a un esquema, y ajustarse a un esquema está disponible desde hace años. La decodificación restringida por gramática llegó con Guidance y Outlines en 2023, llama.cpp lleva GBNF desde ese mismo año, y XGrammar apareció en 2024. Cualquiera de ellos enmascara la distribución de tokens para que la salida no pueda salirse de la gramática. TypeSafe no publicó la arquitectura de Jev, así que no se sabe si llega a la garantía por el mismo camino, y la garantía en sí misma es lo mínimo esperable desde 2023.

## De dónde salen los números del titular

La comparación que produjo el 193.6x y el 444.6x es la evaluación de flujos de trabajo de la propia TypeSafe, y dos detalles sobre ella importan más que el múltiplo.

El primero es la línea base. Esas cifras salen de comparar a Jev contra los modelos más lentos y más caros del conjunto. Medido contra GPT-5.6 Terra, el modelo que TypeSafe posiciona como su par en inteligencia, las ganancias caen a cerca de 25x más rápido y 76x más barato. Sigue siendo un número grande, y no es el que está en la portada.

El segundo es la verdad de referencia. Las respuestas de referencia en esos flujos son un promedio de las respuestas de GPT-6 Astra y Claude Fable 5.1. No hay etiquetado humano. Una evaluación construida así mide coincidencia con dos modelos de frontera, lo que significa que premia reproducir sus errores y castiga acertar cuando ellos se equivocan. Para un producto cuyo argumento es reemplazar a esos modelos en decisiones de producción, la elección de la referencia no es un detalle.

| Afirmación reportada | Medida contra | De igual a igual |
| --- | --- | --- |
| 193.6x más rápido | la línea base más lenta del conjunto | ~25x frente a Terra |
| 444.6x más barato | la línea base más cara del conjunto | ~76x frente a Terra |
| No puede alucinar | conformidad con el esquema | las respuestas erróneas pero válidas no se cuentan |
| Inteligencia competitiva | promedio de dos modelos de frontera como referencia | 61.8% frente al 74.7% de Terra en procesamiento de facturas |

Esa última fila es la que debería frenar a quien compra. En procesamiento de facturas Jev sacó 61.8 por ciento contra el 74.7 por ciento de Terra, una brecha de trece puntos que se disuelve en un promedio sobre cuatro flujos de trabajo elegidos por el proveedor.

TypeSafe dijo buena parte de esto por su cuenta. Su página de lanzamiento señala que los resultados están en el extremo alto de las ganancias del mundo real, que los flujos de trabajo los armaron personas de su propio equipo de capacidades del modelo, así que podría existir algún sesgo, y que las velocidades de la demostración asumen una laptop en la costa oeste. Una empresa que revela que quienes escribieron su benchmark trabajan para la empresa está siendo razonablemente honesta. La cobertura se quedó con el múltiplo y descartó la frase.

## La afirmación que nadie verificó

Todo lo que promete Jev descansa sobre la calibración. La seguridad de tipos garantiza que recibes una respuesta válida, y la calibración es la que debería decirte cuándo esa respuesta no es confiable, para que puedas derivar los casos de baja confianza a una persona o a un modelo más grande. TypeSafe entrena para eso con un método que llama Reinforcement Learning for Calibrated Decisions.

No se han publicado curvas de calibración. Ni diagramas de confiabilidad. Ni verificación independiente. Para un sistema que se vende sobre la premisa de que puedes confiar en sus puntajes de confianza lo suficiente como para actuar en automático, la ausencia de la única medición que lo sustentaría es la mayor pregunta abierta del producto, y casi no se mencionó en la cobertura.

## Qué es, y dónde es bueno

Todo lo anterior no es un argumento de que la cosa sea mala. Es una herramienta estrecha con un alcance real.

| Propiedad | Jev |
| --- | --- |
| Tipos de salida | booleano, opción, puntaje |
| Texto libre | ninguno |
| Razonamiento abierto | ninguno |
| Límite de contexto | 32 000 tokens |
| Latencia | 70 a 500 ms de punta a punta |
| Precio de entrada | $0.042 por millón de tokens, salida gratis |
| Disponibilidad | acceso anticipado |
| Arquitectura, tamaño y datos de entrenamiento publicados | ninguno |

Dentro de ese alcance la economía se ve genuinamente buena, y las afirmaciones de latencia son consistentes con un diseño no autorregresivo que emite su salida de una sola pasada en lugar de token por token. Un ingeniero de Vercel reportó públicamente que cambiar un clasificador de seguridad de comandos de un modelo de OpenAI a Jev devolvió resultados entre cinco y dieciocho veces más rápido y con mejor precisión. Es una persona en una tarea, y es el tipo de evidencia que sí significa algo, porque es una carga de trabajo real con un antes y un después.

Para el trabajo que hacemos esa es la parte interesante. Clasificación, enrutamiento, extracción y puntuación son una porción grande de lo que los clientes nos piden construir, y la mayor parte hoy corre sobre modelos mucho más capaces de lo que la tarea necesita. Un tomador de decisiones estructurado, barato y rápido tiene lugar en esa arquitectura. Lo tiene como componente detrás de una evaluación que corriste sobre tus propios datos etiquetados, no como reemplazo de un sistema que no has medido.

## Cómo se torció esto

Vale nombrar el patrón porque se va a repetir con el próximo lanzamiento.

Una empresa publicó un conjunto de números con sus propias advertencias al lado. Los agregadores repitieron el múltiplo más grande sin las advertencias, porque 193.6x es un titular y 25x contra un par comparable no lo es. Un término técnico de un dominio, alucinación, se aplicó a otra clase de modelo donde significa algo mucho más pequeño, y después los comentaristas trataron la afirmación pequeña como si fuera la grande. La estrechez que hace bueno a Jev, un modelo que hace una cosa en una pasada, se reportó como un desafío a los modelos de lenguaje de propósito general, que es justo lo único que explícitamente no puede hacer.

Quienes estaban en mejor posición para detectarlo no lo hicieron. Poner a prueba la afirmación sobre alucinaciones requiere preguntarse qué cuenta como alucinación para un modelo con tres tipos de salida, que es una reflexión de cinco minutos y no un laboratorio. Nadie necesitaba acceso anticipado para notar que las respuestas de referencia las generaron los modelos a los que se les gana.

Cuando la propia página de un proveedor es más mesurada que los comentarios sobre ella, lo que falló son los comentarios. Antes de adoptar cualquier cosa que llegue con una garantía, pregunta qué propiedad está garantizada, cuál fue la verdad de referencia y quién fuera de la empresa lo verificó. Jev responde bien la primera, mal la segunda, y la tercera no la responde.
