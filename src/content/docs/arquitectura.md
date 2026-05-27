---
title: Arquitectura del Sistema
description: Arquitectura técnica de ULS CyberLab
sidebar:
  order: 4
---

# Arquitectura del Sistema

## Visión General

ULS CyberLab sigue una arquitectura **MVC simplificada** sin framework, construida sobre XAMPP como servidor de desarrollo local. La aplicación es completamente **stateful** gracias a las sesiones PHP.

```
┌─────────────────────────────────────────────┐
│              NAVEGADOR WEB                  │
│         http://localhost/mini-cyberlab/     │
└──────────────────┬──────────────────────────┘
                   │ HTTP/1.1
┌──────────────────▼──────────────────────────┐
│              APACHE (XAMPP)                 │
│              Puerto 80                      │
└──────────────────┬──────────────────────────┘
                   │ PHP-FPM / mod_php
┌──────────────────▼──────────────────────────┐
│              PHP 8.x                        │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  │
│  │ Módulos │  │   APIs   │  │ Includes  │  │
│  │  .php   │  │  .php    │  │   .php    │  │
│  └─────────┘  └──────────┘  └───────────┘  │
└──────────────────┬──────────────────────────┘
                   │ mysqli
┌──────────────────▼──────────────────────────┐
│           MySQL / MariaDB                   │
│           Puerto 3306                       │
│           DB: uls_cyberlab                  │
└─────────────────────────────────────────────┘
```

---

## Capas de la Aplicación

### 1. Capa de Presentación (Frontend)

- **HTML5** generado dinámicamente por PHP
- **CSS3** personalizado (`assets/css/style.css`)
- **JavaScript vanilla** embebido para interactividad
- Sin frameworks frontend (React, Vue, etc.)

**Responsabilidades:**
- Renderizar formularios de login/registro
- Mostrar dashboard con estadísticas
- Actualizar feed de logs (polling AJAX cada 5s)
- Detectar XSS via hook en `window.alert`
- Manejar tabs en login/registro

### 2. Capa de Aplicación (Backend PHP)

#### Páginas Principales
```
index.php        → Maneja GET (mostrar) y POST (procesar login/registro)
dashboard.php    → Requiere sesión, consulta stats y redirige a módulos
modules/*.php    → Laboratorios individuales con lógica de ataque/defensa
```

#### APIs JSON
```
api/logs.php          → GET  → Últimos 8 logs como JSON
api/capture_flag.php  → POST → Captura una flag, devuelve resultado JSON
```

#### Helpers Compartidos
```
includes/db.php      → Conexión mysqli al DB
includes/auth.php    → Sesiones, roles, captura de flags
includes/logger.php  → Registro de eventos de seguridad
```

### 3. Capa de Datos (MySQL)

**Esquema relacional simplificado:**

```sql
users (1) ──< captured_flags >── (N) flags
users (1) ──< security_logs
flags (1) ──< captured_flags
```

---

## Flujo de Datos

### Flujo de Login (SQLi Lab)

```
Usuario ingresa credenciales
        │
        ▼
index.php recibe POST
        │
        ▼
logger.php detecta payload SQLi → security_logs (CRITICAL)
        │
        ▼
db.php ejecuta query VULNERABLE (sin sanitizar)
        │
        ├─── Éxito (SQLi bypass) ──→ auth.php captura FLAG{SQL_1NJ3CT10N_M4ST3R}
        │                                        │
        │                                        ▼
        │                              Redirección a dashboard.php
        │
        └─── Fallo ──→ Mensaje de error
```

### Flujo de Captura de Flag

```
Módulo detecta explotación exitosa
        │
        ▼
POST a /api/capture_flag.php {flag: "FLAG{...}"}
        │
        ▼
auth.php::capture_flag()
        │
        ├─── Valida existencia en tabla flags
        ├─── Verifica que usuario no la tenga ya
        ├─── INSERT en captured_flags
        ├─── UPDATE users.points += flag.points
        └─── logger.php → security_logs (OK)
        │
        ▼
Respuesta JSON {success: true, message: "...", points: N}
```

### Flujo del Dashboard (Polling de Logs)

```
dashboard.php carga
        │
        ▼
JavaScript: setInterval(fetchLogs, 5000)
        │
        ▼
fetch('/mini-cyberlab/api/logs.php')
        │
        ▼
logs.php → SELECT últimos 8 logs
        │
        ▼
JSON response → Update del DOM con nuevos logs
```

---

## Estructura de Archivos Detallada

```
mini-cyberlab/
│
├── index.php                 # Punto de entrada: Login + Registro
│   ├── GET  → Renderiza formulario dual (tabs)
│   └── POST → Procesa auth (login vulnerable, registro seguro)
│
├── dashboard.php             # Panel principal (requiere sesión)
│   ├── Stats: flags, puntos, usuarios, logs
│   ├── Feed de logs (actualización AJAX)
│   ├── Scoreboard Top 10
│   └── Links a módulos
│
├── modules/
│   ├── sqli.php              # Lab SQL Injection
│   │   ├── Challenge 1: Ver index.php (login bypass)
│   │   └── Challenge 2: GET ?search= → UNION SELECT
│   │
│   ├── xss.php               # Lab Cross-Site Scripting
│   │   ├── Reflected: GET ?q= → echo sin escapar
│   │   └── Stored: POST comment → render sin escapar
│   │
│   ├── upload.php            # Lab File Upload
│   │   ├── POST file → guarda en ../uploads/ sin validar
│   │   └── Lista archivos subidos con links
│   │
│   └── bruteforce.php        # Lab Brute Force
│       ├── Crea usuario ceo/qwerty si no existe
│       ├── Login form sin rate limiting
│       └── Muestra contador de intentos últimos 5min
│
├── api/
│   ├── logs.php              # GET → JSON {logs: [...]}
│   └── capture_flag.php      # POST flag= → JSON resultado
│
├── includes/
│   ├── db.php                # mysqli connection + global $conn
│   ├── auth.php              # Sesiones, roles, flags, helpers
│   └── logger.php            # log_event(), get_recent_logs()
│
├── assets/
│   └── css/style.css         # Tema dark hacker (~587 líneas)
│
├── sql/
│   └── setup.sql             # Schema completo + datos iniciales
│
└── uploads/                  # Creado en runtime (NO en repo)
    └── [archivos subidos por usuarios]
```

---

## Decisiones de Arquitectura

### ¿Por qué PHP sin framework?

1. **Accesibilidad:** Los estudiantes de la ULS ya conocen PHP básico
2. **Transparencia:** El código es fácil de leer y auditar
3. **Compatibilidad:** Funciona con cualquier instalación de XAMPP
4. **Sin dependencias:** No requiere Composer, npm, ni build tools
5. **Vulnerabilidades más claras:** Es más fácil ver el código vulnerable cuando no hay abstracciones de framework

### ¿Por qué no usar sesiones en las APIs?

Las APIs requieren `session_start()` y verifican `$_SESSION['user_id']`, protegiendo los endpoints de acceso anónimo. Esto es una característica de seguridad intencional.

### ¿Por qué el upload va a `../uploads/`?

La carpeta `uploads/` está fuera del directorio de cada módulo pero dentro del webroot de XAMPP, permitiendo que los archivos sean servidos directamente por Apache — lo que hace posible que un webshell PHP subido sea **ejecutado** por el servidor. Esto es intencional para el laboratorio.

---

## Límites del Sistema

| Límite | Valor | Motivo |
|--------|-------|--------|
| Logs mostrados en dashboard | 8 | Performance |
| Polling interval | 5 segundos | Balance UX/performance |
| Scoreboard | Top 10 | UI |
| Total flags | 7 | Diseño del curso |
| Puntos máximos | 150 | Escala del CTF |
