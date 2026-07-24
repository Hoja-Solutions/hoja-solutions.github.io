---
title: "Por qué construimos open-source"
description: "El código de este sitio es un repositorio público de GitHub, y también lo es el resto de nuestro stack. El argumento práctico para construir sobre open source."
date: 2026-07-22T12:00:00
tags: ["Open Source", "Ingeniería"]
---

El código de este sitio es un repositorio público de GitHub. Puedes bifurcarlo, leer el historial de commits y ver el razonamiento detrás de cada decisión. Exigimos ese mismo estándar a las herramientas de las que dependemos, y lo aplicamos en el trabajo que hacemos para los clientes.

Nuestro stack es abierto de arriba a abajo: los modelos que ejecutamos, los frameworks con los que construimos, las bases de datos que consultamos, el CI que nos despliega. Cuando algo se rompe, no abrimos un ticket y esperamos el ciclo de lanzamiento de un proveedor. Leemos el código, encontramos el error y lo corregimos, o tomamos la corrección que alguien más ya escribió. Cuando una dependencia deja de encajar, la bifurcamos. Quien usa la herramienta mantiene el control de ella.

Construimos los proyectos de los clientes sobre modelos open-source y los ejecutamos en la propia infraestructura del cliente, bajo sus credenciales, sin que nada salga de su red. El modelo es suyo para ajustar, cuantizar o reemplazar, sin una API externa entre ellos y el sistema que toma decisiones sobre sus datos. Para un equipo que maneja datos regulados o código sensible, esa es la diferencia entre adoptar una herramienta y descartarla.

También escribimos código open-source para nuestro propio trabajo. Este sitio es el ejemplo más simple. Lee el código fuente y ves todo el stack, la estructura y las decisiones detrás de él, sin un SDK propietario estorbando. Cuando podemos, enviamos parches, documentación y herramientas de vuelta al upstream, porque el ecosistema se sostiene solo cuando la gente aporta de vuelta.

Quienes dependen de ese código para su propio trabajo ya lo leyeron y lo probaron, así que los errores salen a la luz temprano y la corrección suele existir ya. El costo sigue a lo que ejecutas en lugar del número de licencias o de tokens. Puedes inspeccionar qué hace la herramienta en lugar de confiar en una descripción: el modelo y el algoritmo están frente a ti, y verificas la salida por tu cuenta.

Cuando un cliente pregunta por qué elegimos una herramienta en particular, la respuesta es corta. Es abierta, la revisamos y funciona. La barrera para entregar software sigue bajando, y una computadora más la capacidad de leer código te lleva la mayor parte del camino. Las herramientas open-source cubren el resto.
