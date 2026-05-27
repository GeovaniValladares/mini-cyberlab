---
title: Objetivos
description: Objetivos generales y específicos del proyecto ULS CyberLab
sidebar:
  order: 2
---

# Objetivos del Proyecto

## Objetivo General

Desarrollar una plataforma web educativa de hacking ético que permita a los estudiantes de la Universidad Luterana Salvadoreña comprender, identificar y practicar las vulnerabilidades web más comunes del **OWASP Top 10**, en un entorno controlado, seguro y accesible, fomentando el pensamiento crítico en seguridad informática.

---

## Objetivos Específicos

### 🎓 Educativos

1. **Proporcionar experiencia práctica** en la identificación y explotación de vulnerabilidades web reales (SQLi, XSS, File Upload, Brute Force) sin riesgo para sistemas externos.

2. **Reforzar la comprensión teórica** de los conceptos de seguridad informática mediante laboratorios interactivos que conectan la teoría con la práctica.

3. **Desarrollar el pensamiento ofensivo** (offensive security mindset) en los estudiantes, capacitándolos para pensar como atacantes para poder defender mejor.

4. **Enseñar buenas prácticas de programación** segura al mostrar el contraste entre código vulnerable y código seguro dentro de la misma plataforma.

5. **Fomentar el aprendizaje autónomo** con retos tipo CTF (Capture The Flag) que motivan a los estudiantes a explorar más allá de lo indicado en clase.

### 🛠️ Técnicos

1. **Implementar un sistema de SQL Injection** (login bypass y UNION-based) que demuestre el impacto real de la concatenación de strings en consultas SQL.

2. **Simular ataques XSS** tanto reflejados como almacenados, mostrando cómo el código JavaScript malicioso puede ejecutarse en el contexto de otros usuarios.

3. **Demostrar los riesgos del File Upload sin restricciones** mediante la carga de webshells PHP funcionales que permiten ejecución remota de comandos.

4. **Mostrar la vulnerabilidad de sistemas sin rate limiting** mediante ataques de fuerza bruta con herramientas reales (Hydra, Burp Suite).

5. **Implementar un sistema de logging en tiempo real** que registre y visualice todos los intentos de ataque, correlacionando eventos de seguridad.

6. **Crear un sistema CTF funcional** con banderas, puntos y scoreboard para gamificar el aprendizaje.

### 🌐 De Impacto Social

1. **Democratizar el acceso** a recursos de ciberseguridad en El Salvador, ofreciendo una herramienta gratuita y de código abierto.

2. **Contribuir a FESOL 2026** con un proyecto que demuestre la importancia de la seguridad en el desarrollo de software.

3. **Promover la ética profesional** en seguridad informática, enseñando que el conocimiento de ataques debe usarse exclusivamente para proteger.

4. **Crear conciencia** sobre las consecuencias de las malas prácticas de programación en la seguridad de aplicaciones web reales.

---

## Metas Cuantificables

| Meta | Indicador | Valor Objetivo |
|------|-----------|----------------|
| Laboratorios implementados | Número de módulos funcionales | 4 laboratorios |
| Flags CTF | Número de banderas capturables | 7 flags |
| Puntos totales | Sistema de puntuación | 150 puntos |
| Vulnerabilidades cubiertas | OWASP Top 10 | 4 categorías |
| Tiempo de instalación | Minutos desde descarga a funcionamiento | < 10 minutos |
| Compatibilidad | Sistema operativo | Windows + Linux |

---

## Relación con Competencias del Curso

El proyecto se alinea con las competencias del curso de Seguridad Informática de la ULS:

```
✅ Identificar vulnerabilidades en aplicaciones web
✅ Aplicar técnicas de ethical hacking documentadas
✅ Comprender el impacto de vulnerabilidades OWASP
✅ Desarrollar conciencia de seguridad en programación
✅ Usar herramientas profesionales (Burp Suite, Hydra)
✅ Documentar hallazgos de seguridad
```

---

## Lo que NO es un Objetivo

:::caution[Importante - Uso Ético]
**Este proyecto NO tiene como objetivo:**
- Enseñar a atacar sistemas sin autorización
- Proporcionar herramientas para actividades ilegales
- Reemplazar el conocimiento de seguridad con trucos
- Funcionar fuera de un entorno de laboratorio controlado

El hacking ético siempre requiere **autorización explícita** del propietario del sistema.
:::
