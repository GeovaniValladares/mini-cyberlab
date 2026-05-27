---
title: Introducción
description: Introducción al proyecto ULS CyberLab - Mini Laboratorio de Hacking Ético
sidebar:
  order: 1
  badge:
    text: Inicio
    variant: tip
---

# Introducción a ULS CyberLab

## ¿Qué es el proyecto?

**ULS CyberLab** (Mini Laboratorio de Hacking Ético) es una aplicación web educativa desarrollada en **PHP puro sobre XAMPP**, diseñada específicamente para el curso de **Seguridad Informática** de la **Universidad Luterana Salvadoreña (ULS)** y presentada en la **Feria del Software Libre 2026 (FESOL 2026)**.

El proyecto simula un entorno web real con **vulnerabilidades intencionales** de las más comunes en la industria, permitiendo a los estudiantes aprender hacking ético de forma práctica y segura, sin riesgo de dañar sistemas reales.

## Contexto Académico

| Aspecto | Detalle |
|---------|---------|
| **Institución** | Universidad Luterana Salvadoreña (ULS) |
| **Evento** | FESOL 2026 - Feria del Software Libre |
| **Curso** | Seguridad Informática |
| **País** | El Salvador |
| **Año** | 2026 |
| **Modalidad** | Laboratorio presencial / red local |

## El Problema que Resuelve

La seguridad informática es una disciplina que **requiere práctica real** para comprenderse plenamente. Sin embargo, practicar en sistemas reales es:

- **Ilegal** sin autorización explícita
- **Peligroso** para la infraestructura
- **Inaccesible** para la mayoría de estudiantes (no todos tienen acceso a labs pagados como HackTheBox, TryHackMe, etc.)

**ULS CyberLab** resuelve esto creando un entorno completamente controlado, local y gratuito donde los estudiantes pueden:

1. Comprender cómo funcionan las vulnerabilidades reales
2. Practicar técnicas de ataque en un ambiente seguro
3. Ver el impacto real de las malas prácticas de programación
4. Aprender a mitigar y prevenir cada tipo de ataque

## Filosofía del Proyecto

> *"Para defender sistemas, primero debes entender cómo se atacan."*

Este proyecto sigue la filosofía del **hacking ético**: usar el conocimiento de las técnicas de ataque únicamente para proteger y mejorar la seguridad, nunca para dañar. Cada vulnerabilidad implementada en la plataforma viene acompañada de:

- **Explicación teórica** del ataque
- **Demostración práctica** con payloads reales
- **Consecuencias** de la vulnerabilidad
- **Contramedidas** y buenas prácticas de mitigación

## Inspiración Técnica

El proyecto está inspirado en plataformas reconocidas de práctica en seguridad:

- **[DVWA](http://www.dvwa.co.uk/)** (Damn Vulnerable Web Application)
- **[WebGoat](https://owasp.org/www-project-webgoat/)** (OWASP)
- **[HackTheBox](https://www.hackthebox.com/)**
- **[TryHackMe](https://tryhackme.com/)**
- **[PortSwigger Web Security Academy](https://portswigger.net/web-security)**

A diferencia de estas, **ULS CyberLab** está adaptada al contexto y recursos disponibles en El Salvador, funcionando completamente offline con XAMPP.

## Estructura General

```
mini-cyberlab/
├── index.php          # Login / Registro (vulnerable SQLi)
├── dashboard.php      # Panel principal con logs y scoreboard
├── modules/           # Laboratorios de vulnerabilidades
│   ├── sqli.php       # SQL Injection (UNION-based)
│   ├── xss.php        # Cross-Site Scripting (Reflected + Stored)
│   ├── upload.php     # Unrestricted File Upload / Webshell
│   └── bruteforce.php # Brute Force (sin rate limiting)
├── api/               # Endpoints JSON
│   ├── logs.php       # Feed de logs de seguridad
│   └── capture_flag.php # Captura de banderas CTF
├── includes/          # Lógica de negocio
│   ├── db.php         # Conexión a base de datos
│   ├── auth.php       # Autenticación y flags
│   └── logger.php     # Sistema de logging
├── assets/css/        # Estilos (tema dark hacker)
└── sql/setup.sql      # Schema y datos iniciales
```

## Audiencia Objetivo

| Perfil | Descripción |
|--------|-------------|
| **Estudiantes ULS** | Alumnos del curso de Seguridad Informática |
| **Visitantes FESOL** | Personas interesadas en ciberseguridad |
| **Docentes** | Para uso en demostraciones en clase |
| **Autodidactas** | Cualquier persona que quiera aprender hacking ético de forma segura |

## Próximos Pasos

- [Leer los Objetivos del proyecto →](/objetivos/)
- [Ver las Características principales →](/caracteristicas/)
- [Ir directo a los Laboratorios →](/laboratorios/)
- [Instalar el proyecto →](/instalacion/)
