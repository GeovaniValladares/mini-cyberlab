---
title: Tecnologías
description: Stack tecnológico completo de ULS CyberLab
sidebar:
  order: 7
---

# Stack Tecnológico

## Resumen del Stack

ULS CyberLab fue construido con tecnologías accesibles y ampliamente utilizadas en El Salvador, priorizando la **claridad del código** sobre la sofisticación arquitectónica.

```
Frontend          Backend           Base de Datos      Servidor
──────────        ──────────        ─────────────      ──────────
HTML5             PHP 8.x           MySQL/MariaDB      Apache 2.4
CSS3 vanilla      mysqli            uls_cyberlab DB    XAMPP 8.x
JS vanilla        PHP Sessions
Google Fonts
```

---

## Backend: PHP 8.x

### ¿Por qué PHP?

| Razón | Detalle |
|-------|---------|
| **Ubicuidad** | El lenguaje web más usado en hosting compartido |
| **Conocido** | Los estudiantes ULS ya lo conocen del pensum |
| **Transparente** | Código fácil de leer para identificar vulnerabilidades |
| **Sin compilación** | Editar y recargar directamente |
| **XAMPP** | Configuración cero en Windows |

### Características PHP Utilizadas

```php
// Sesiones para autenticación
session_start();
$_SESSION['user_id'] = $user['id'];

// mysqli para base de datos (con y sin prepared statements)
$conn = new mysqli($host, $user, $pass, $dbname);

// Prepared statements (para código seguro de contraste)
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);

// Funciones nativas
htmlspecialchars()  // (debería usarse pero no se usa en labs)
password_hash()     // (debería usarse pero no se usa en labs)
file_get_contents() // Para lectura de archivos
move_uploaded_file() // Para el lab de upload
```

### Versión y Compatibilidad

| Versión PHP | Compatibilidad |
|------------|----------------|
| PHP 8.0 | ✅ Mínimo soportado |
| PHP 8.1 | ✅ Recomendado |
| PHP 8.2 | ✅ Completo |
| PHP 8.3 | ✅ Completo |
| PHP 7.4 | ⚠️ Puede funcionar con cambios menores |
| PHP 7.0-7.3 | ❌ No compatible |

---

## Base de Datos: MySQL / MariaDB

### ¿Por qué MySQL?

- Incluido en XAMPP sin configuración adicional
- Motor de base de datos más enseñado en universidades de Centroamérica
- SQL estándar, ideal para el laboratorio de SQL Injection
- phpMyAdmin incluido para gestión visual

### Extensión de PHP: mysqli

El proyecto usa `mysqli` (MySQL Improved) en lugar de PDO:

```php
// Conexión básica (vulnerable por diseño en labs)
$conn = new mysqli('localhost', 'root', '', 'uls_cyberlab');

// Query directa (vulnerable - para laboratorio)
$result = $conn->query("SELECT * FROM users WHERE username = '$username'");

// Prepared statement (seguro - para contraste)
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
```

### Charset: utf8mb4

```sql
-- Soporte completo de Unicode incluyendo emojis
CREATE DATABASE uls_cyberlab
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

---

## Servidor Web: Apache 2.4

### Configuración usada (XAMPP default)

```apache
# DocumentRoot por defecto de XAMPP
DocumentRoot "C:/xampp/htdocs"

# El proyecto accede vía:
# http://localhost/mini-cyberlab/

# PHP procesado vía mod_php o PHP-FPM
```

### Módulos Apache relevantes

| Módulo | Uso |
|--------|-----|
| `mod_php` | Ejecutar PHP embebido |
| `mod_rewrite` | URLs amigables (no usado actualmente) |
| `mod_mime` | Tipos MIME de archivos (relevante para file upload lab) |

---

## Frontend: HTML5 + CSS3 + JavaScript Vanilla

### HTML5

- Formularios con `action`, `method`, `enctype="multipart/form-data"`
- Generado dinámicamente por PHP (`<?= ?>` shorthand)
- Estructura semántica: `nav`, `main`, `section`, `article`

### CSS3 — Tema Dark Hacker

```css
/* Paleta principal */
--bg-primary:    #0a0e1a;  /* Azul noche */
--bg-secondary:  #0d1221;  /* Sidebar/Nav */
--accent-green:  #00ff88;  /* Verde neon */
--accent-dim:    #00cc66;  /* Verde secundario */
--text-primary:  #e0e0e0;  /* Texto principal */
--text-dim:      #888b96;  /* Texto secundario */
--danger-red:    #ff4444;  /* Alertas críticas */
--warning-amber: #ffaa00;  /* Advertencias */
```

**Técnicas CSS usadas:**
- Variables CSS (`--variable`)
- Flexbox para layout
- CSS Grid para cards
- Transiciones y animaciones
- Media queries para responsividad

### JavaScript Vanilla

```javascript
// Polling de logs (dashboard.php)
setInterval(async () => {
  const res = await fetch('/mini-cyberlab/api/logs.php');
  const data = await res.json();
  updateLogsUI(data.logs);
}, 5000);

// Hook de alert para XSS lab (xss.php)
const originalAlert = window.alert;
window.alert = function(msg) {
  originalAlert(msg);
  // Captura automática de flag cuando se ejecuta alert()
  fetch('/mini-cyberlab/api/capture_flag.php', {
    method: 'POST',
    body: 'flag=FLAG{XSS_R3FL3CT3D}'
  });
};

// Detección de XSS stored (xss.php)
document.addEventListener('DOMContentLoaded', () => {
  const comments = document.querySelectorAll('.comment');
  comments.forEach(c => {
    if (c.innerHTML.includes('<script>')) {
      // Captura flag de stored XSS
    }
  });
});
```

---

## Tipografía: Google Fonts

| Fuente | Tipo | Uso |
|--------|------|-----|
| **Fira Code** | Monospace | Código, payloads, flags, terminal |
| **Inter** | Sans-serif | UI general, texto, navegación |

```html
<!-- Carga desde CDN de Google -->
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## Herramientas de Apoyo (Externas)

### Para el Laboratorio de Brute Force

**Hydra** (Kali Linux):
```bash
hydra -l ceo -P /usr/share/wordlists/rockyou.txt \
  localhost http-post-form \
  "/mini-cyberlab/modules/bruteforce.php:username=^USER^&password=^PASS^:Credenciales incorrectas" \
  -V -t 10
```

**Burp Suite Community:**
- Proxy HTTP para interceptar peticiones
- Intruder para ataques de diccionario con GUI
- Repeater para manipular peticiones manualmente

---

## Lo que NO se usa (intencionalmente)

| Tecnología | ¿Por qué no? |
|------------|-------------|
| Laravel / Symfony | Demasiada abstracción, oculta las vulnerabilidades |
| PDO | Se usa mysqli para mostrar el contraste con prepared statements |
| React / Vue | Innecesario para el scope del proyecto |
| Docker | Aumenta la complejidad de instalación |
| Composer | Sin dependencias externas necesarias |
| npm | Sin build process necesario |
| password_hash() | Intencional — passwords en texto plano para los labs |
| htmlspecialchars() | Intencional — output sin escapar para XSS labs |

---

## Comparativa: Código Vulnerable vs Seguro

El proyecto enseña el contraste mostrando ambos estilos:

```php
// ❌ VULNERABLE (Login form - para el lab SQLi)
$query = "SELECT * FROM users 
          WHERE username = '$username' 
          AND password = '$password'";
$result = $conn->query($query);

// ✅ SEGURO (Register form - para mostrar el contraste)
$stmt = $conn->prepare(
  "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $username, $password, $role);
$stmt->execute();
```

Esta dualidad es el núcleo educativo del proyecto.
