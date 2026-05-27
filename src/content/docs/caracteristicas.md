---
title: Características
description: Características principales de ULS CyberLab
sidebar:
  order: 3
---

# Características del Proyecto

## Resumen de Características

ULS CyberLab es una plataforma completa con múltiples funcionalidades diseñadas para maximizar el aprendizaje en seguridad informática.

---

## 🔐 Sistema de Autenticación Dual

La página de login implementa **intencionalmente** dos niveles de seguridad para demostrar el contraste:

### Login (Vulnerable - para el laboratorio)
```php
// Código vulnerable - NO usar en producción
$query = "SELECT id, username, role 
          FROM users 
          WHERE username = '$username' AND password = '$password'";
```
- Concatenación directa de strings → **SQL Injection posible**
- Detección automática de payloads SQLi con logging `CRITICAL`
- Captura automática de flag al explotar exitosamente

### Registro (Seguro - para demostración de contraste)
```php
// Código seguro con prepared statements
$stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $password, $role);
```
- Usa prepared statements correctamente
- Muestra que la seguridad es una **elección de diseño**

---

## 📊 Dashboard en Tiempo Real

El panel principal ofrece una vista completa del estado del laboratorio:

### Estadísticas en Vivo
| Widget | Descripción |
|--------|-------------|
| **Flags Capturadas** | Banderas obtenidas por el usuario actual |
| **Puntos Acumulados** | Score total del usuario |
| **Total Usuarios** | Número de participantes registrados |
| **Eventos de Seguridad** | Número de intentos registrados |

### Feed de Logs de Seguridad
- Actualización automática cada **5 segundos** via AJAX
- Niveles de severidad codificados por color:
  - 🔵 `INFO` — Actividad normal
  - 🟡 `WARNING` — Actividad sospechosa
  - 🔴 `CRITICAL` — Ataque detectado
  - 🟢 `OK` — Flag capturada exitosamente

### Scoreboard (Top 10)
- Clasificación en tiempo real de todos los participantes
- Ordenado por: puntos totales → flags capturadas
- Actualización dinámica conforme los estudiantes capturan flags

---

## 🧪 4 Módulos de Laboratorio

### Módulo 1: SQL Injection (SQLi)
| Característica | Detalle |
|---------------|---------|
| **Tipo** | Error-based + UNION-based |
| **Vectores** | Login form + Search parameter |
| **Dificultad** | Principiante → Intermedio |
| **Flags** | 2 banderas (10 + 20 puntos) |
| **Muestra query** | Sí — el estudiante puede ver el SQL ejecutado |

**Retos:**
1. Bypass de login con `' OR '1'='1`
2. Extracción de datos con `UNION SELECT`

### Módulo 2: Cross-Site Scripting (XSS)
| Característica | Detalle |
|---------------|---------|
| **Tipo** | Reflected + Stored |
| **Vectores** | Parámetro GET `q` + Formulario de comentarios |
| **Dificultad** | Principiante |
| **Flags** | 2 banderas (10 + 20 puntos) |
| **Detección automática** | Sí — hook en `window.alert` |

**Retos:**
1. Reflected XSS con `<script>alert('XSS')</script>`
2. Stored XSS persistente en comentarios

### Módulo 3: File Upload
| Característica | Detalle |
|---------------|---------|
| **Tipo** | Unrestricted File Upload → RCE |
| **Vectores** | Formulario de carga sin validación |
| **Dificultad** | Intermedio |
| **Flags** | 1 bandera (25 puntos) |
| **Ejecución real** | Sí — webshell PHP funcional |

**Retos:**
1. Subir `shell.php` con webshell
2. Acceder a `http://localhost/mini-cyberlab/uploads/shell.php?cmd=whoami`

### Módulo 4: Brute Force
| Característica | Detalle |
|---------------|---------|
| **Tipo** | Credential Stuffing + Dictionary Attack |
| **Vectores** | Formulario de login sin rate limiting |
| **Dificultad** | Principiante |
| **Flags** | 1 bandera (15 puntos) |
| **Herramientas sugeridas** | Hydra, Burp Suite Intruder |

**Retos:**
1. Encontrar credenciales de usuario `ceo` con diccionario

---

## 🚩 Sistema CTF (Capture The Flag)

### Captura Automática
Varios módulos detectan automáticamente cuando el ataque es exitoso:
- Login con payload SQLi → Flag automática
- UNION SELECT con datos de tabla → Flag automática
- Alert de XSS → Hook JavaScript captura la flag
- Subida de PHP → Flag automática
- Login como `ceo` vía brute force → Flag automática

### Captura Manual
Formulario disponible en cada módulo para ingresar el código de flag manualmente.

### API de Flags
```
POST /api/capture_flag.php
Content-Type: application/x-www-form-urlencoded

flag=FLAG{CODIGO_AQUI}
```
Respuesta JSON con estado de captura, puntos ganados y mensaje.

---

## 🔍 Sistema de Logging de Seguridad

### Eventos Registrados

| Evento | Nivel | Módulo |
|--------|-------|--------|
| Intento de SQLi detectado | CRITICAL | sqli/login |
| XSS payload detectado | WARNING | xss |
| Archivo PHP subido | CRITICAL | upload |
| Múltiples intentos fallidos | WARNING | bruteforce |
| Flag capturada | OK | ctf |
| Login exitoso | INFO | auth |
| Registro de usuario | INFO | auth |

### Estructura del Log
```json
{
  "id": 42,
  "log_level": "CRITICAL",
  "module": "login",
  "message": "SQLi detectado en username: ' OR '1'='1",
  "ip_address": "127.0.0.1",
  "created_at": "2026-05-26 18:30:00"
}
```

---

## 🎨 Interfaz de Usuario

### Tema Visual
- **Paleta:** Dark mode con acento verde (`#00ff88`) — estética "terminal hacker"
- **Tipografía:** `Fira Code` (mono) + `Inter` (UI) — Google Fonts
- **Fondo:** `#0a0e1a` (azul noche profundo)
- **Responsive:** Funcional en desktop y tablet

### Componentes UI
- Cards de estadísticas con números en tiempo real
- Feed de logs con color por severidad
- Tabla de scoreboard con posición
- Módulos con secciones de: descripción, payload hint, resultado, formulario de flag

---

## 🗄️ Base de Datos

### Tablas del Sistema

| Tabla | Propósito |
|-------|-----------|
| `users` | Gestión de usuarios y puntos |
| `flags` | Definición de flags y puntuación |
| `captured_flags` | Registro de flags capturadas por usuario |
| `security_logs` | Historial de eventos de seguridad |
| `comments` | Comentarios para el lab de XSS |
| `secrets` | Datos confidenciales para el lab de SQLi |

---

## ✅ Características de Seguridad (Intencionales e Inintencionales)

| Característica | ¿Segura? | Propósito |
|---------------|----------|-----------|
| Login form SQL | ❌ Vulnerable | Laboratorio SQLi |
| Register form | ✅ Seguro | Demostración de contraste |
| XSS output | ❌ Vulnerable | Laboratorio XSS |
| File upload | ❌ Sin validación | Laboratorio Upload |
| Brute force form | ❌ Sin rate limit | Laboratorio Brute Force |
| Flag capture API | ✅ Requiere sesión | Funcionalidad protegida |
| Logs API | ✅ Requiere sesión | Datos internos |
| Passwords en DB | ❌ Plaintext | Intencional para labs |
