---
title: Guía de Laboratorios
description: Guía completa de los laboratorios prácticos de ULS CyberLab
sidebar:
  order: 20
---

# Laboratorios Prácticos

## Introducción a los Labs

Los laboratorios de ULS CyberLab están diseñados para que **practiques ataques reales** en un entorno seguro y controlado. Cada módulo incluye:

- 📖 **Contexto teórico** breve antes del ataque
- 🎯 **Objetivo claro** de lo que debes lograr
- 💡 **Hints** si te quedas atascado
- 🚩 **Flags CTF** que capturar como prueba del éxito
- 🛡️ **Sección de mitigación** para aprender a defender

---

## Mapa de Laboratorios

```
ULS CyberLab
├── Lab 1: SQL Injection ──────────── /laboratorios/sqli/
│   ├── Challenge 1: Login Bypass (10 pts)
│   └── Challenge 2: UNION SELECT (20 pts)
│
├── Lab 2: Cross-Site Scripting ───── /laboratorios/xss/
│   ├── Challenge 1: Reflected XSS (10 pts)
│   └── Challenge 2: Stored XSS (20 pts)
│
├── Lab 3: File Upload ─────────────── /laboratorios/upload/
│   └── Challenge 1: Webshell Upload (25 pts)
│
└── Lab 4: Brute Force ─────────────── /laboratorios/bruteforce/
    └── Challenge 1: Dictionary Attack (15 pts)
                            
CTF Bonus: FLAG{ULS_CYB3RL4B_W1NN3R} (50 pts) — Busca la pista en el sistema
```

---

## Puntuación y Scoreboard

| Lab | Challenge | Puntos | Dificultad |
|-----|-----------|--------|-----------|
| SQL Injection | Login Bypass | 10 pts | 🟢 Fácil |
| SQL Injection | UNION SELECT | 20 pts | 🟡 Medio |
| XSS | Reflected | 10 pts | 🟢 Fácil |
| XSS | Stored | 20 pts | 🟡 Medio |
| File Upload | Webshell | 25 pts | 🟡 Medio |
| Brute Force | Dictionary | 15 pts | 🟢 Fácil |
| CTF Bonus | Secreto | 50 pts | 🔴 Difícil |
| **Total** | **7 flags** | **150 pts** | |

---

## Reglas del Laboratorio

:::tip[Reglas de Ética]
1. **Solo practica en ULS CyberLab** — nunca uses estas técnicas en sistemas reales sin autorización explícita
2. **Documenta tu progreso** — anota qué payloads funcionaron y por qué
3. **Intenta entender, no solo copiar** — el objetivo es aprender, no solo capturar flags
4. **Ayuda a otros** — si terminas primero, ayuda a tus compañeros sin darles la respuesta directamente
5. **No elimines datos** — en Stored XSS, no borres los comentarios de otros estudiantes
:::

---

## Credenciales de Acceso

| Usuario | Contraseña | Rol | Notas |
|---------|-----------|-----|-------|
| `admin` | `password` | Administrador | Cuenta principal para los labs |
| `estudiante` | `password` | Estudiante | Para practicar como usuario normal |
| `root` | `toor` | Administrador | Alternativa |
| `invitado` | `12345` | Estudiante | Cuenta de prueba |
| `ceo` | `???` | Administrador | **¡Encuentra la contraseña en el Lab 4!** |

---

## Flujo Recomendado

```
1. Regístrate o inicia sesión en http://localhost/mini-cyberlab/
                    ↓
2. Explora el dashboard y conoce la interfaz
                    ↓
3. Inicia con Lab 1 (SQL Injection) - es el más fundamental
                    ↓
4. Continúa con Lab 2 (XSS) - relacionado con el frontend
                    ↓
5. Lab 3 (File Upload) - escala hacia RCE
                    ↓
6. Lab 4 (Brute Force) - automatización de ataques
                    ↓
7. Busca el CTF Bonus - ¡está escondido en algún lugar del sistema!
```

---

## Comenzar los Laboratorios

- [Lab 1: SQL Injection →](/laboratorios/sqli/)
- [Lab 2: Cross-Site Scripting →](/laboratorios/xss/)
- [Lab 3: File Upload →](/laboratorios/upload/)
- [Lab 4: Brute Force →](/laboratorios/bruteforce/)
