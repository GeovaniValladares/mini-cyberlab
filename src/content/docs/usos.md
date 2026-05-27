---
title: Usos y Aplicaciones
description: Casos de uso y aplicaciones del proyecto ULS CyberLab
sidebar:
  order: 9
---

# Usos y Aplicaciones

## Casos de Uso Principales

### 1. Clases Magistrales de Seguridad Informática

**Escenario:** El docente proyecta ULS CyberLab al frente del aula y demuestra en tiempo real cómo funcionan las vulnerabilidades.

**Cómo se usa:**
1. Docente muestra el código vulnerable en el proyector
2. Ejecuta el payload frente a los estudiantes
3. El dashboard muestra en tiempo real el log de seguridad
4. Explica las consecuencias y la contramedida

**Valor educativo:**
- Los estudiantes ven el impacto inmediato del código inseguro
- Conexión directa entre teoría y práctica
- El registro de ataques hace visible algo que normalmente es "invisible"

---

### 2. Laboratorios Prácticos en Grupos

**Escenario:** En el laboratorio de informática, cada estudiante trabaja en su propia instancia de ULS CyberLab instalada en su PC.

**Estructura sugerida del laboratorio:**

```
Hora 0:00 - 0:15  → Introducción teórica al tipo de vulnerabilidad
Hora 0:15 - 0:45  → Práctica individual en el módulo correspondiente
Hora 0:45 - 1:00  → Discusión: "¿Cómo lo mitigarías?"
Hora 1:00 - 1:15  → Revisión del código fuente del módulo
```

**Competencia CTF:** Usando el scoreboard, los laboratorios pueden convertirse en una competencia amigable donde el primero en capturar todas las flags gana.

---

### 3. FESOL 2026 — Demostración Pública

**Escenario:** En la Feria del Software Libre, el proyecto se presenta a visitantes de todas las edades como una demostración interactiva de ciberseguridad.

**Setup para FESOL:**
```
1 servidor (laptop) con XAMPP corriendo
Red WiFi local del stand
Visitantes se conectan con sus dispositivos móviles/laptops
Tablet en el stand mostrando el dashboard con el scoreboard
```

**Atractivos para visitantes:**
- Probar un "hack real" (aunque sea en un entorno seguro)
- Ver su nombre en el scoreboard
- Entender por qué la seguridad importa

---

### 4. Autoaprendizaje Individual

**Escenario:** Un estudiante instala ULS CyberLab en su PC y practica por su cuenta, siguiendo esta documentación.

**Ruta de aprendizaje sugerida:**

```
Semana 1: Instalar y explorar el proyecto
          ↓ Leer el código fuente de index.php
          ↓ Completar el Lab 1 (SQL Injection básico)

Semana 2: SQL Injection avanzado
          ↓ Completar Lab 1 Challenge 2 (UNION SELECT)
          ↓ Leer sobre OWASP A03:2021

Semana 3: XSS
          ↓ Completar Lab 2 (Reflected + Stored)
          ↓ Investigar Content Security Policy (CSP)

Semana 4: File Upload + Brute Force
          ↓ Completar Labs 3 y 4
          ↓ Investigar mitigaciones
```

---

### 5. Preparación para Certificaciones

ULS CyberLab es un excelente primer paso antes de plataformas más avanzadas:

| Después de ULS CyberLab | Siguiente paso recomendado |
|------------------------|---------------------------|
| SQL Injection | PortSwigger SQL Injection Labs |
| XSS | PortSwigger XSS Labs, Bug Bounty |
| File Upload | HackTheBox Easy machines |
| Brute Force | TryHackMe rooms |
| General | eJPT (INE), CompTIA Security+ |

---

### 6. Desarrollo de Materiales de Curso

**Para docentes:** El proyecto puede usarse como material base para:

- Exámenes prácticos: "Captura las 7 flags y documenta cómo lo hiciste"
- Tareas de mitigación: "Arregla las vulnerabilidades del código"
- Proyectos de fin de semestre: "Agrega un nuevo módulo de vulnerabilidad"
- Reportes de seguridad: "Escribe un reporte de pentest del sistema"

---

## Usos por Perfil de Usuario

### 👨‍🎓 Estudiante Principiante

**Objetivo:** Entender qué es una vulnerabilidad web  
**Qué hace en ULS CyberLab:**
- Sigue las instrucciones del módulo
- Copia y pega los payloads sugeridos
- Observa qué pasa en el dashboard
- Lee las explicaciones de cada vulnerabilidad

**Flags que debería capturar:** Todas las automáticas (4-5 flags)

### 👨‍💻 Estudiante Intermedio

**Objetivo:** Entender cómo funcionan los ataques  
**Qué hace en ULS CyberLab:**
- Lee el código fuente de los módulos
- Modifica los payloads para explorar más
- Usa Burp Suite para interceptar peticiones
- Intenta capturar flags de formas no documentadas

**Flags que debería capturar:** Todas (7 flags)

### 👩‍🏫 Docente

**Objetivo:** Demostrar vulnerabilidades en clase  
**Qué hace en ULS CyberLab:**
- Configura el servidor para toda la clase
- Proyecta el dashboard durante las demos
- Configura el scoreboard para competencias
- Usa el código como ejemplo en explicaciones

### 🔍 Investigador / Contribuidor

**Objetivo:** Extender el proyecto  
**Qué puede agregar:**
- Nuevos módulos de vulnerabilidades (SSRF, XXE, IDOR)
- Nuevas flags y retos
- Mejoras a la UI
- Documentación adicional
- Traducción a otros idiomas

---

## Limitaciones de Uso

| Limitación | Razón |
|-----------|-------|
| No usar en internet | Las vulnerabilidades son reales y explotables |
| No usar en red corporativa | Puede afectar a otros sistemas |
| No usar datos reales | El DB está en texto plano |
| No es una plataforma final de seguridad | Es educativa, no de producción |
| No reemplaza CTFs avanzados | Es un punto de partida |

---

## Extensiones Futuras Posibles

El proyecto puede extenderse para incluir:

```
Nuevos Laboratorios:
├── CSRF (Cross-Site Request Forgery)
├── IDOR (Insecure Direct Object Reference)  
├── SSRF (Server-Side Request Forgery)
├── XXE (XML External Entity)
├── Command Injection
├── Path Traversal / LFI
└── Deserialization

Mejoras al Sistema:
├── Modo CTF con tiempo límite
├── Pistas progresivas (hints) por reto
├── Sistema de reportes de pentest
├── Modo multi-equipo (rojo vs azul)
└── Integración con Kali Linux tools
```
