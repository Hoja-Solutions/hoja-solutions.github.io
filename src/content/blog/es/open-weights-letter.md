---
title: "La carta de los open weights: qué le pidieron 25 empresas a Washington, y qué dejaron fuera"
description: "NVIDIA, Microsoft, Meta y otras 22 firmaron una carta que sostiene que Estados Unidos no debe restringir los modelos descargables. Leímos las tres páginas, verificamos con nuestro propio trabajo la única afirmación que podemos comprobar y anotamos lo que la carta evita."
date: 2026-07-24T12:00:00
tags: ["IA", "Open Source", "Políticas"]
---

Veinticinco empresas estadounidenses publicaron hoy una carta que le pide a Washington no restringir los modelos de IA de pesos abiertos, y Jensen Huang usó la primera publicación de su vida en X para ponerla frente a todos. Entre las firmas están NVIDIA, Microsoft, Meta, IBM, Dell, Palantir, CrowdStrike, Mozilla, Hugging Face, Mistral, la Linux Foundation, Andreessen Horowitz e Y Combinator. OpenAI, Anthropic y Google no firmaron.

La carta ocupa tres páginas y lleva un título que anuncia su enfoque: [Open Weights and American AI Leadership](https://images.nvidia.com/pdf/Open-Weights-and-American-AI-Leadership.pdf). Huang agregó una línea propia en X: "El mundo necesita tanto modelos cerrados de frontera como modelos abiertos de frontera".

## Qué cambió con Kimi K3

Ocho días antes de la carta, Moonshot AI, con sede en Pekín, lanzó Kimi K3. Tiene 2.8 billones de parámetros totales como mezcla dispersa de expertos, y activa 16 de 896 expertos enrutados por token, que es la forma en que un modelo de ese tamaño responde a una velocidad usable. Arena lo ubicó primero en Frontend Code, por delante de Claude Fable 5, en pruebas ciegas con desarrolladores. Índices independientes lo colocaron segundo y tercero en general, detrás de Fable 5 y GPT-5.6 Sol. Moonshot lo lanzó primero como servicio alojado y se comprometió a publicar los pesos completos bajo una licencia MIT modificada antes del 27 de julio.

Esa combinación es la que convirtió el lanzamiento de un modelo en un problema de política pública. Un modelo descargable quedó a pocos puntos de los mejores sistemas cerrados estadounidenses en tablas públicas, y cuesta menos por tarea que Claude Opus 4.8. Michael Kratsios, asesor de la Casa Blanca, acusó a Moonshot de usar destilación para replicar un modelo estadounidense. Washington empezó a evaluar restricciones a los pesos de libre descarga.

La tendencia detrás de ese momento es más antigua. La familia Qwen de Alibaba superó a Llama de Meta como la familia de modelos abiertos más descargada de Hugging Face en septiembre de 2025, y un análisis conjunto del MIT y Hugging Face puso a los modelos chinos por delante de los estadounidenses en participación de descargas del Hub ese mismo año. Las empresas que escriben esta carta defienden el liderazgo estadounidense en una categoría donde los modelos estadounidenses dejaron de liderar las descargas hace un buen rato.

## Qué argumenta la carta

La carta abre en los años ochenta, con los pioneros del software open-source que discutieron la creencia de que el software solo avanzaría si las empresas mantenían un control estricto sobre su código. Los firmantes señalan que el código open-source hoy sostiene la mayor parte de internet y sirve de base a sistemas de las mayores empresas tecnológicas, del ejército estadounidense y de agencias federales. Definen los pesos abiertos como lo haría alguien de ingeniería: modelos que cualquiera puede "descargar, inspeccionar, modificar y ejecutar en su propia infraestructura".

El argumento económico es el más concreto. Los pesos abiertos le permiten a una organización "asignar el modelo correcto a la tarea correcta al costo correcto, reservando la capacidad de escala de frontera para problemas genuinamente de frontera y ejecutando modelos eficientes y especializados en todo lo demás". La carta trata esa disciplina como lo que vuelve sostenible el costo de la IA cuando escala a miles de millones de tareas cotidianas, y nombra dónde aterriza el valor: "los flujos de trabajo de fábricas, hospitales, granjas, aulas y negocios de barrio".

Después invierte el argumento de seguridad habitual. Los firmantes admiten el riesgo sin rodeos: "Una vez publicados, los pesos quedan fuera del control del desarrollador original, y las versiones modificadas son difíciles de rastrear o revertir". Su respuesta es que concentrar la capacidad dentro de unos pocos modelos cerrados produce un número reducido de puntos únicos de falla, que los modelos cerrados "pueden ser vulnerados, usados de forma indebida o fallar de maneras que los externos no pueden detectar", y que quien defiende frente a atacantes con IA avanzada necesita modelos de capacidad comparable para simular amenazas y responder a ellas. La transparencia le ganó a la opacidad en la seguridad del software, y ellos sostienen que la IA seguirá el mismo camino.

Cuatro pedidos cierran la carta: ampliar el acceso a cómputo para startups e investigadores, invertir en activos de entrenamiento compartidos como datasets y marcos de evaluación, mantener plural la frontera "evitando restricciones prematuras a los modelos abiertos que ahoguen la competencia o lleven la innovación al exterior", y fortalecer las capas de aplicación que ponen la IA a trabajar en la economía.

Un párrafo existe por Kratsios. La carta sostiene que quienes legislan no deberían confundir el desarrollo legítimo de modelos con la apropiación indebida, que la destilación es una técnica de uso extendido para mejorar, evaluar y validar modelos, y que la extracción ilícita desde modelos cerrados merece "marcos legales y comerciales específicos en lugar de restricciones amplias sobre técnicas". Una norma escrita para castigar a Moonshot caería sobre todos los que entrenan un modelo pequeño con las salidas de uno más grande, que son la mayoría de los equipos que hacen trabajo aplicado.

## La afirmación que sí podemos comprobar

Hay un argumento que podemos verificar con nuestras propias facturas, y es el de asignar el modelo a la tarea. La mayor parte de lo que los clientes nos piden construir no necesita un modelo de frontera. Clasificación, extracción, enrutamiento, resumen y redacción funcionan bien en un modelo abierto de la clase de 27B cuantizado dentro de los 24 GB de VRAM de una sola tarjeta de consumo. Con uno de ellos construimos este sitio. El modelo de frontera justifica su precio en el razonamiento difícil, y atiende una fracción pequeña del total de llamadas.

El mecanismo importa más que el ahorro. Cuando el modelo corre en el hardware del propio cliente, el costo sigue a máquinas que ya compró en lugar de tokens que mide, y los datos nunca salen de su red. Para un equipo que maneja datos regulados o código sensible, esa segunda propiedad decide si puede adoptar la herramienta o no. La frase de la carta sobre reservar la capacidad de frontera para problemas de frontera describe una arquitectura que ya entregamos, y deja de estar disponible en el momento en que los pesos dejan de ser descargables.

## Qué deja fuera la carta

Las tres páginas no contienen una sola estadística. Los firmantes construyen un argumento económico y de seguridad sobre modelos descargables sin citar una cifra de descargas, un benchmark, una comparación de costos ni un incidente. Para un documento dirigido a quienes deben ponderar un riesgo medible, la ausencia es una decisión.

"Prematuras" carga con mucho peso y nunca se define. La carta le pide a Washington no actuar demasiado pronto sin nombrar qué restricción sería razonable ni qué evidencia justificaría una. También admite que los pesos publicados no se pueden retirar, y luego ofrece el escrutinio de la comunidad como respuesta, que sirve para descubrir un problema más que para contenerlo.

Vale decir los incentivos con claridad. NVIDIA vende aceleradores a todo el que entrena o sirve un modelo, y un mundo con muchos modelos corriendo en muchos lugares vende más de ellos que un mundo con cinco. Microsoft alquila acceso a modelos cerrados en Azure y aloja modelos abiertos. Meta publica pesos abiertos como estrategia competitiva. Un argumento puede ser correcto e interesado a la vez, y este es ambas cosas.

La carta nunca dice la palabra China. El modelo que la volvió urgente es chino, la participación de descargas a la que responde de forma implícita es china, y la acusación de destilación que moldeó su párrafo más defensivo apuntaba a un laboratorio de Pekín. Nombrar al competidor habría obligado a los firmantes a explicar cómo se mantiene plural la frontera mientras se restringe a los laboratorios que hoy lideran la categoría abierta, así que lo dejaron fuera.

Sobre las tres empresas que no firmaron: OpenAI, Anthropic y Google construyen los modelos cerrados de frontera que esta carta describe como puntos únicos de falla, y tanto OpenAI como Anthropic han impulsado reglas más estrictas alrededor de la destilación. Un párrafo que defiende la destilación como una tradición de aprender de la tecnología existente y mejorarla no es algo que ninguna de las dos pueda firmar sin contradecir sus propios documentos.

Para un equipo que decide sobre qué construir, esta pelea se reduce a una pregunta: ¿seguirán los pesos siendo descargables en dos años? Veinticinco empresas con dinero apostado al sí acaban de decirle a Washington que la respuesta debería seguir siendo sí. Nosotros necesitamos la misma respuesta por una razón más estrecha, y es que esa es la única versión de esto en la que el modelo corre dentro de la red del cliente y los datos se quedan ahí.
