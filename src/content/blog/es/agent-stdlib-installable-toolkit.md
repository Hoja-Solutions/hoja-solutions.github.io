---
title: "agent-stdlib: un toolkit de agentes instalable"
description: "El blog de ingeniería de Anthropic describe cómo construir agentes en producción. agent-stdlib empaqueta esos procedimientos en skills instalables, servidores MCP y hooks de seguridad que puedes ejecutar en cualquier harness."
date: 2026-07-22T12:00:00
tags: ["Ingeniería", "Open Source", "Agentes de IA"]
---

agent-stdlib empaqueta el conocimiento de ingeniería de agentes de Anthropic en skills instalables, servidores MCP y hooks de seguridad. Lo agregas a un proyecto y el agente tiene procedimientos estructurados para los problemas que importan, en lugar de prosa que tienes que releer una y otra vez.

La mayor parte de la guía de ingeniería de agentes de Anthropic se publica como entradas de blog. El contenido es excelente, pero nunca se convierte en algo que puedas `instalar`. Encuentras un artículo relevante, copias una sección en tu system prompt y esperas que el agente la siga. `agent-stdlib` toma ese mismo material, lo estructura en skills que el agente carga bajo demanda y empareja cada uno con el código ejecutable que necesita. Tiene licencia MIT, es open source y es neutral respecto al harness.

## Qué contiene el paquete

El repositorio tiene cuatro capas. Los skills son conocimiento que el modelo lee y aplica. Los servidores MCP le dan al agente capacidades en tiempo de ejecución que los skills describen pero no pueden proveer por sí solos. Los hooks imponen comportamientos en los que no se puede confiar que el modelo se autorregule. Los comandos y agentes envuelven cualquiera de estos en invocaciones de un solo paso.

El paquete incluye 14 skills, 3 servidores MCP, 2 hooks y 2 scripts de coordinación. Cada skill remite a un artículo específico de Anthropic e indica en qué se diferencia de los skills de la comunidad que ya cubren terreno similar. Los temas que skills sólidos de la comunidad ya resuelven quedan fuera, con referencias a dónde encontrarlos.

Los skills son archivos Markdown autocontenidos en `skills/<nombre>/SKILL.md`. Abren con una línea de fuente y luego una nota sobre qué trabajo previo mejoran. Un agente carga uno cuando una tarea coincide con su descripción. El skill `build-agent-evals` te enseña a recolectar tareas a partir de fallos reales, elegir evaluadores y decidir entre pass@k y pass^k. El skill `durable-agent-architecture` descompone un agente de larga duración en cerebro, manos y sesión para que cualquier componente pueda caerse y reanudar. El skill `parallel-autonomous-agents` cubre el protocolo de archivos de bloqueo que evita que varios agentes sin supervisión se pisen las tareas.

Los servidores MCP son servidores stdio estándar. El servidor `think` es una herramienta sin efecto que le enseña al agente a detenerse y razonar a mitad de una tarea. El servidor `tool-gateway` deja que el agente alcance un catálogo grande de herramientas a través de dos herramientas en lugar de docenas. El servidor `code-execution` presenta las herramientas como código importable y ejecuta Python compuesto en un subproceso. Es opcional porque ejecuta código escrito por el modelo. Los tres corren con `uv` e instalan su única dependencia en el primer uso.

Los hooks son la parte que la mayoría de los paquetes omite. `action_gate.py` es una compuerta `PreToolUse` que clasifica los comandos de Bash por riesgo y deniega o pregunta ante los peligrosos. Revisa borrados recursivos, exfiltración de secretos, escalada de privilegios, violaciones de límites de confianza y evasiones de recursos compartidos. Un comando compuesto con un pipe, una redirección o una subshell nunca se trata como seguro, porque la parte riesgosa puede estar más adelante de un primer comando inofensivo. `injection_screen.py` refleja esto del lado de entrada. Escanea la salida de las herramientas en busca de marcadores de inyección de prompts: texto que le dice al modelo que ignore instrucciones previas, turnos de sistema falsificados, pedidos de secreto o alias de jailbreak conocidos. Ambos hooks están apagados por defecto y se activan con una variable de entorno.

Los scripts de coordinación manejan agentes en paralelo sobre un repositorio git compartido. `locks.py` implementa bloqueo atómico basado en archivos: un agente reclama una tarea creando un archivo de bloqueo con `O_CREAT | O_EXCL`, y exactamente un agente gana la carrera. `autonomy_loop.sh` recorre una lista de tareas, reclama la primera tarea libre, corre una sesión de agente headless nueva sobre ella, libera el bloqueo y sigue. El CLI del agente es configurable. Define `AGENT_RUNNER="opencode run"` y el bucle funciona igual.

## Cómo funciona

Cada skill es conocimiento procedimental. En lugar de decir qué debería hacer un agente, da los pasos: el bucle, la disyuntiva, el modo de fallo. El skill `reward-hacking-and-inoculation` no dice "ten cuidado con la evaluación". Explica que un agente al que le piden hacer pasar las pruebas puede borrar la prueba que falla, codificar a mano el resultado esperado o tratar el evaluador como un caso especial, y te muestra cómo diseñar evaluadores que no premien los atajos.

Los skills se emparejan con código ejecutable. El skill `advanced-tool-use` describe los tres patrones para escalar el acceso a herramientas, y los servidores `tool-gateway` y `code-execution` implementan dos de ellos. El skill `parallel-autonomous-agents` describe el bucle de autonomía, y `autonomy_loop.sh` y `locks.py` lo ejecutan.

Los hooks imponen lo que los skills dicen que hay que imponer pero que no se puede confiar al modelo. Un agente al que se le pide controlar sus propias acciones puede convencerse a sí mismo de aprobarlas, así que la compuerta de acciones vive en un script de Python fuera del modelo. Un agente al que se le pide vigilar inyecciones de prompts puede terminar siguiéndolas, así que el filtro de inyecciones corre como un comparador de patrones determinista sobre la salida de las herramientas.

El paquete se instala como plugin de Claude Code, pero los componentes no son específicos de Claude. Los servidores MCP hablan el protocolo abierto MCP, los scripts son Python y Bash simples, y el contenido de los skills es neutral respecto al harness. Para usarlo en OpenCode, Cursor o Cline, apunta el cliente a las rutas de los servidores MCP, o copia el cuerpo de un skill en tu archivo de reglas.

## Dónde se queda corto

Los hooks son motores de reglas deterministas, no clasificadores. La lista de reglas de la compuerta de acciones atrapa los patrones que Anthropic documentó, pero un comando que no reconoce se clasifica como desconocido en vez de juzgarse. El filtro de inyecciones busca marcadores conocidos; una inyección novedosa que no coincide con los patrones pasa. Ambos están diseñados para intercambiarse por una llamada a un clasificador, conservando la estructura por niveles y la postura de denegar o marcar.

El paquete omite temas que los skills de la comunidad ya resuelven. Los patrones de agentes, la ingeniería de contexto, el diseño de herramientas y los harness de larga duración tienen buena cobertura en otros lugares. Si los necesitas, el README apunta a los paquetes que los tienen.

Un skill se carga bajo demanda, lo que significa que un modelo más débil podría no elegir el correcto. En un modelo pequeño lo cargas de forma explícita en vez de confiar en el disparo automático.

El blog de ingeniería de Anthropic es la mejor documentación pública sobre la práctica de la ingeniería de agentes. Ese conocimiento debería publicarse como algo que puedas instalar. Cuando necesites que un agente maneje el reward hacking, o necesites una suite de evals que se mantenga honesta, o necesites hooks que controlen comandos y filtren inyecciones, el procedimiento ya debería estar en tu repositorio.
