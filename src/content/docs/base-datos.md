---
title: Base de Datos
description: Documentación completa de la base de datos de ULS CyberLab
sidebar:
  order: 16
---

# Base de Datos

## Información General

| Aspecto | Detalle |
|---------|---------|
| **Motor** | MySQL / MariaDB |
| **Nombre** | `uls_cyberlab` |
| **Charset** | `utf8mb4` |
| **Collation** | `utf8mb4_unicode_ci` |
| **Host** | `localhost` |
| **Puerto** | `3306` |
| **Usuario** | `root` (XAMPP default) |
| **Contraseña** | *(vacía - XAMPP default)* |

---

## Diagrama Entidad-Relación

```
users                    flags                  captured_flags
─────────────────        ─────────────────      ──────────────────────
id (PK)                  id (PK)                id (PK)
username                 module                 user_id (FK → users.id)
password                 flag_code (UNIQUE)     flag_id (FK → flags.id)
role                     description            captured_at
points                   points
created_at
    │                        │                       │
    └────────────────────────┘───────────────────────┘
              N:M via captured_flags

users                    security_logs          comments
─────────────────        ─────────────────      ─────────────────
id (PK) ──────────────►  user_id (FK)           id (PK)
                         log_level              comment
                         module                 user_id (FK → users.id)
                         message                created_at
                         ip_address
                         created_at

                         secrets
                         ─────────────────
                         id (PK)
                         secret_name
                         secret_value
```

---

## Tablas

### `users` — Usuarios del Sistema

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- ⚠️ Plaintext (intencional para labs)
    role ENUM('admin', 'estudiante') DEFAULT 'estudiante',
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT | Identificador único |
| `username` | VARCHAR(50) | Nombre de usuario (único) |
| `password` | VARCHAR(255) | Contraseña en **texto plano** (intencional) |
| `role` | ENUM | `admin` o `estudiante` |
| `points` | INT | Puntos acumulados en el CTF |
| `created_at` | TIMESTAMP | Fecha de registro |

**Datos iniciales:**

| username | password | role |
|----------|----------|------|
| admin | password | admin |
| estudiante | password | estudiante |
| root | toor | admin |
| invitado | 12345 | estudiante |

### `flags` — Definición de Flags CTF

```sql
CREATE TABLE flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(50) NOT NULL,
    flag_code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    points INT DEFAULT 10
);
```

**Datos:**

| module | flag_code | points |
|--------|-----------|--------|
| sqli | `FLAG{SQL_1NJ3CT10N_M4ST3R}` | 10 |
| sqli | `FLAG{UN10N_S3L3CT_PR0}` | 20 |
| bruteforce | `FLAG{BRUT3_F0RC3_K1NG}` | 15 |
| xss | `FLAG{XSS_R3FL3CT3D}` | 10 |
| xss | `FLAG{XSS_ST0R3D_PWN3D}` | 20 |
| upload | `FLAG{W3BSH3LL_UPL04D3D}` | 25 |
| ctf | `FLAG{ULS_CYB3RL4B_W1NN3R}` | 50 |

### `captured_flags` — Flags Capturadas por Usuario

```sql
CREATE TABLE captured_flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flag_id INT NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (flag_id) REFERENCES flags(id),
    UNIQUE KEY unique_capture (user_id, flag_id)
);
```

La constraint `UNIQUE KEY unique_capture` impide que un usuario capture la misma flag dos veces.

### `security_logs` — Registro de Eventos de Seguridad

```sql
CREATE TABLE security_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_level ENUM('INFO', 'WARNING', 'CRITICAL', 'OK') DEFAULT 'INFO',
    module VARCHAR(50) DEFAULT 'system',
    message TEXT NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Ejemplo de entradas:**

| log_level | module | message | ip_address |
|-----------|--------|---------|-----------|
| CRITICAL | login | SQLi detectado en username: ' OR '1'='1 | 127.0.0.1 |
| WARNING | bruteforce | Intento fallido #15 para usuario: ceo | 127.0.0.1 |
| OK | ctf | Flag capturada: FLAG{XSS_R3FL3CT3D} | 127.0.0.1 |
| INFO | auth | Login exitoso: admin | 127.0.0.1 |

### `comments` — Comentarios del Lab XSS

```sql
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Contiene los comentarios del laboratorio de XSS. Los comentarios se almacenan **sin sanitizar** (preparados con prepared statements, pero renderizados sin `htmlspecialchars()`).

### `secrets` — Datos Confidenciales (Target del Lab SQLi)

```sql
CREATE TABLE secrets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    secret_name VARCHAR(100),
    secret_value TEXT
);
```

**Datos (targets del UNION SELECT):**

| secret_name | secret_value |
|-------------|-------------|
| api_key | `sk_live_ULS_2026_FAKE_API_KEY` |
| admin_token | `eyJhbGciOiJIUzI1NiJ9...` (JWT fake) |
| hidden_flag | `FLAG{UN10N_S3L3CT_PR0}` |

---

## Queries Importantes

### Ver todos los usuarios y sus puntos

```sql
SELECT username, role, points, created_at 
FROM users 
ORDER BY points DESC;
```

### Ver el scoreboard

```sql
SELECT 
    u.username,
    u.points,
    COUNT(cf.id) as flags_captured
FROM users u
LEFT JOIN captured_flags cf ON u.id = cf.user_id
GROUP BY u.id
ORDER BY u.points DESC, flags_captured DESC
LIMIT 10;
```

### Ver flags capturadas por usuario

```sql
SELECT 
    u.username,
    f.flag_code,
    f.points,
    cf.captured_at
FROM captured_flags cf
JOIN users u ON cf.user_id = u.id
JOIN flags f ON cf.flag_id = f.id
ORDER BY cf.captured_at DESC;
```

### Ver logs recientes de seguridad

```sql
SELECT log_level, module, message, ip_address, created_at
FROM security_logs
ORDER BY created_at DESC
LIMIT 20;
```

### Resetear el CTF (todos los puntos a 0)

```sql
-- Útil para reiniciar entre sesiones de laboratorio
DELETE FROM captured_flags;
UPDATE users SET points = 0;
DELETE FROM security_logs;
DELETE FROM comments;
```

---

## Conexión desde PHP

```php
// includes/db.php
$host   = 'localhost';
$user   = 'root';
$pass   = '';           // Vacío en XAMPP por defecto
$dbname = 'uls_cyberlab';

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

$conn->set_charset('utf8mb4');
```

---

## Restaurar la Base de Datos

Si necesitas resetear completamente la BD:

```sql
DROP DATABASE IF EXISTS uls_cyberlab;
SOURCE sql/setup.sql;
```

O vía phpMyAdmin:
1. Seleccionar `uls_cyberlab`
2. **Operaciones** → **Eliminar la base de datos**
3. Importar de nuevo `sql/setup.sql`
