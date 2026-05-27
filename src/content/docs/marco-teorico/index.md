---
title: Marco Teórico
description: Fundamentos teóricos de seguridad informática aplicados en ULS CyberLab
sidebar:
  order: 10
---

# Marco Teórico

## Fundamentos de Seguridad Informática

La seguridad informática es la disciplina que se encarga de la **protección de los sistemas de información** —hardware, software, datos y redes— contra accesos no autorizados, daños, robo o interrupciones.

### La Tríada CIA

El pilar fundamental de la seguridad informática es la **Tríada CIA**:

```
        ╔══════════════╗
        ║ CONFIDENCIAL ║
        ║     (C)      ║
        ╚══════╤═══════╝
               │
    ╔══════════╧════════╗
    ║   INTEGRIDAD (I)  ║
    ╚══════════╤════════╝
               │
        ╔══════╧═══════╗
        ║ DISPONIBILIDAD║
        ║      (A)      ║
        ╚══════════════╝
```

| Principio | Definición | Amenaza Relacionada |
|-----------|------------|---------------------|
| **Confidencialidad** | Solo usuarios autorizados acceden a la información | SQL Injection extrae datos privados |
| **Integridad** | La información no es alterada sin autorización | XSS modifica el contenido para otros usuarios |
| **Disponibilidad** | El sistema está disponible cuando se necesita | DoS/Brute Force puede bloquear el acceso |

---

## Seguridad en Aplicaciones Web

Las aplicaciones web son el vector de ataque más común en el mundo moderno porque:

1. **Son accesibles desde cualquier lugar** (internet)
2. **Procesan datos sensibles** (credenciales, información personal, datos financieros)
3. **Son desarrolladas por equipos** con distintos niveles de conocimiento en seguridad
4. **Evolucionan constantemente** sin revisiones de seguridad formales

### El Ciclo de Vida de un Ataque Web

```
Reconocimiento → Escaneo → Explotación → Post-explotación → Limpieza de huellas
     │               │           │              │
  Recolectar     Encontrar   Ejecutar       Mantener
  información    puntos de   el ataque      acceso /
  del target     entrada                    extraer datos
```

ULS CyberLab simula la fase de **Explotación** en un entorno controlado.

---

## OWASP Top 10

**OWASP** (Open Web Application Security Project) es una fundación sin fines de lucro que publica la lista de las **10 vulnerabilidades web más críticas**. ULS CyberLab cubre 4 de estas categorías:

| Posición | Categoría OWASP | En ULS CyberLab |
|----------|-----------------|-----------------|
| A01:2021 | Broken Access Control | Parcialmente (roles) |
| **A02:2021** | **Cryptographic Failures** | Passwords en texto plano |
| **A03:2021** | **Injection** | ✅ SQL Injection Lab |
| A04:2021 | Insecure Design | Diseño vulnerable por naturaleza |
| A05:2021 | Security Misconfiguration | XAMPP sin hardening |
| A06:2021 | Vulnerable Components | N/A |
| **A07:2021** | **Identification & Authentication Failures** | ✅ Brute Force Lab |
| A08:2021 | Software & Data Integrity Failures | N/A |
| A09:2021 | Security Logging & Monitoring Failures | Contraste (logs implementados) |
| **A10:2021** | **Server-Side Request Forgery** | ❌ No implementado |

Y adicionalmente:
- **XSS** (antes A07 en OWASP 2017, ahora parte de Injection)
- **File Upload** vulnerabilities

---

## Hacking Ético vs Hacking Malicioso

| Aspecto | Hacking Ético | Hacking Malicioso |
|---------|--------------|-------------------|
| **Autorización** | Siempre con permiso | Sin permiso |
| **Objetivo** | Mejorar la seguridad | Daño, robo, extorsión |
| **Legalidad** | Legal | Ilegal |
| **Documentación** | Reporte formal | Oculta rastros |
| **Disclosure** | Responsable (responsible disclosure) | Vende exploits, hackea más |

### El Marco Legal en El Salvador

La Ley Especial Contra los Delitos Informáticos y Conexos establece que:
- Acceder sin autorización a sistemas informáticos → penado con prisión
- El hacking sin permiso es un **delito** en El Salvador
- ULS CyberLab está diseñado para que siempre haya **autorización implícita** del entorno de laboratorio

---

## Vulnerabilidades Cubiertas

Cada sección del Marco Teórico cubre una vulnerabilidad en profundidad:

- [**SQL Injection →**](/marco-teorico/sql-injection/) — La más crítica de las inyecciones de código
- [**Cross-Site Scripting →**](/marco-teorico/xss/) — Ejecución de código en el navegador de la víctima
- [**File Upload Attacks →**](/marco-teorico/file-upload/) — De subida de archivos a control del servidor
- [**Brute Force →**](/marco-teorico/bruteforce/) — Ataques de diccionario y automatización
- [**OWASP Top 10 →**](/marco-teorico/owasp/) — Contexto completo de las vulnerabilidades web

---

## Recursos de Estudio Recomendados

| Recurso | URL | Tipo |
|---------|-----|------|
| OWASP Top 10 | [owasp.org/Top10](https://owasp.org/Top10) | Documentación oficial |
| PortSwigger Academy | [portswigger.net/web-security](https://portswigger.net/web-security) | Labs gratuitos |
| HackTricks | [book.hacktricks.xyz](https://book.hacktricks.xyz) | Referencia de técnicas |
| TryHackMe | [tryhackme.com](https://tryhackme.com) | Plataforma de práctica |
| HackTheBox | [hackthebox.com](https://www.hackthebox.com) | CTF avanzado |
| DVWA | [dvwa.co.uk](http://www.dvwa.co.uk) | App vulnerable similar |
