---
title: OWASP Top 10
description: OWASP Top 10 y su relación con ULS CyberLab
sidebar:
  order: 15
---

# OWASP Top 10

## ¿Qué es OWASP?

**OWASP** (Open Web Application Security Project) es una fundación sin fines de lucro dedicada a mejorar la seguridad del software. Su lista **OWASP Top 10** es el estándar de referencia mundial para las vulnerabilidades web más críticas, actualizado periódicamente basándose en datos reales de la industria.

**Sitio oficial:** [owasp.org](https://owasp.org)  
**Versión actual:** OWASP Top 10 2021

---

## OWASP Top 10 — 2021

### A01:2021 — Broken Access Control

**Descripción:** Las restricciones sobre lo que los usuarios autenticados pueden hacer no se implementan correctamente.

**En ULS CyberLab:**
- Los módulos verifican sesión (`require_login()`) ✅
- Pero no hay verificación de rol estricta en todos los módulos ⚠️

**Ejemplo real:**
```
URL: /admin/users → Solo debería acceder admin
URL: /user/1/edit → ¿Puede el usuario 2 editar al usuario 1?
```

**Impacto:** Acceso no autorizado a datos, modificación de datos de otros usuarios, escalación de privilegios.

---

### A02:2021 — Cryptographic Failures

**Descripción:** Fallo en la protección de datos en tránsito o en reposo. Antes conocido como "Sensitive Data Exposure".

**En ULS CyberLab (intencional):**
```sql
-- Passwords en texto plano
INSERT INTO users (username, password) VALUES ('admin', 'password');
```

**Cómo debería ser:**
```php
// ✅ Con hashing seguro
$hash = password_hash($password, PASSWORD_ARGON2ID);
// ✅ Verificación
password_verify($input_password, $stored_hash);
```

**En producción también:**
- HTTPS obligatorio (TLS)
- Certificados válidos
- Cifrado de datos sensibles en BD

---

### A03:2021 — Injection

**Descripción:** Datos no confiables enviados a un intérprete como parte de un comando o consulta. Incluye SQL Injection, Command Injection, LDAP Injection, etc.

**En ULS CyberLab:** ✅ **Implementado en Labs 1 y 2**

```php
// SQL Injection (login)
$query = "SELECT * FROM users WHERE username = '$username'";

// Command Injection (si existiera)
system("ping " . $_GET['host']);
```

**La solución:** Parametrización, validación de entrada, uso de APIs seguras.

→ Ver [Marco Teórico: SQL Injection](/marco-teorico/sql-injection/)

---

### A04:2021 — Insecure Design

**Descripción:** Falta de controles de seguridad en el diseño de la aplicación. No se puede "arreglar" con un parche — requiere rediseño.

**En ULS CyberLab:** El diseño **es** inseguro intencionalmente. Un diseño seguro incluiría:

- Modelado de amenazas en la fase de diseño
- Principio de mínimo privilegio desde el inicio
- Controles de seguridad como parte del flujo de negocio
- Revisiones de seguridad en cada sprint

---

### A05:2021 — Security Misconfiguration

**Descripción:** Configuraciones incorrectas de seguridad en cualquier nivel de la pila tecnológica.

**En ULS CyberLab / XAMPP:**
```
❌ MySQL con usuario root sin contraseña
❌ Contraseñas por defecto en todos los usuarios
❌ display_errors = On (muestra errores de PHP en producción)
❌ Carpeta uploads/ sin restricciones de ejecución
❌ phpMyAdmin expuesto (http://localhost/phpmyadmin)
```

**Correcciones:**
```php
// No mostrar errores en producción
ini_set('display_errors', 0);
error_reporting(0);
// Log a archivo en lugar de pantalla
ini_set('log_errors', 1);
ini_set('error_log', '/var/log/php_errors.log');
```

---

### A06:2021 — Vulnerable and Outdated Components

**Descripción:** Usar componentes (librerías, frameworks, etc.) con vulnerabilidades conocidas.

**En ULS CyberLab:** No aplica directamente (sin dependencias externas). En aplicaciones reales:
- Usar `composer audit` para PHP
- `npm audit` para Node.js
- `pip-audit` para Python
- Actualizar regularmente

---

### A07:2021 — Identification and Authentication Failures

**Descripción:** Fallas en la autenticación que permiten comprometer contraseñas, claves o tokens de sesión.

**En ULS CyberLab:** ✅ **Implementado en Lab 4 (Brute Force)**

```php
// Sin rate limiting
// Sin CAPTCHA
// Passwords en texto plano
// Sin MFA
// Credenciales por defecto (admin/password)
```

→ Ver [Marco Teórico: Brute Force](/marco-teorico/bruteforce/)

---

### A08:2021 — Software and Data Integrity Failures

**Descripción:** Código e infraestructura que no protegen contra violaciones de integridad. Incluye deserialization insegura y CI/CD comprometido.

**Ejemplo:**
```php
// ❌ Deserialización insegura
$data = unserialize($_COOKIE['user_data']);
```

No implementado en ULS CyberLab pero importante conocer.

---

### A09:2021 — Security Logging and Monitoring Failures

**Descripción:** Falta de logging adecuado, monitoreo y respuesta a incidentes.

**ULS CyberLab implementa el contraste:**
```php
// ✅ Logging implementado (logger.php)
log_event('CRITICAL', 'login', "SQLi detectado: $username");
log_event('WARNING', 'bruteforce', "Múltiples intentos fallidos desde $ip");
log_event('OK', 'ctf', "Flag capturada: FLAG{...} por usuario $user_id");
```

El dashboard muestra estos logs en tiempo real — mostrando cómo un SOC (Security Operations Center) monitorearía amenazas.

---

### A10:2021 — Server-Side Request Forgery (SSRF)

**Descripción:** El servidor hace peticiones HTTP a recursos controlados por el atacante.

```php
// ❌ SSRF
$url = $_GET['url'];
$content = file_get_contents($url);  // El atacante puede poner: http://169.254.169.254/ (AWS metadata)
```

No implementado en ULS CyberLab pero relevante en aplicaciones cloud.

---

## Cobertura de OWASP en ULS CyberLab

```
A01 Broken Access Control     ⚠️  Parcial (roles básicos)
A02 Cryptographic Failures    ✅  Implementado (passwords planos - para lab)
A03 Injection                 ✅  Implementado completamente (Labs 1 y 2)
A04 Insecure Design           ✅  Todo el proyecto lo demuestra
A05 Security Misconfiguration ✅  XAMPP sin hardening (intencional)
A06 Vulnerable Components     ❌  N/A (sin dependencias)
A07 Auth Failures             ✅  Implementado (Lab 4 - Brute Force)
A08 Integrity Failures        ❌  No implementado
A09 Logging Failures          ✅  Contraste - logs implementados
A10 SSRF                      ❌  No implementado
```

**Adicionalmente (fuera del Top 10 2021):**
- XSS → ✅ Labs 3a y 3b (Reflected + Stored)
- File Upload → ✅ Lab 3 (Unrestricted Upload + RCE)

---

## OWASP Testing Guide

Para cada vulnerabilidad, OWASP documenta cómo **probarla**:

| Técnica | Descripción |
|---------|-------------|
| **WSTG-INPV-05** | Testing for SQL Injection |
| **WSTG-CLNT-01** | Testing for Reflected XSS |
| **WSTG-CLNT-02** | Testing for Stored XSS |
| **WSTG-BUSL-08** | Test Upload of Unexpected File Types |
| **WSTG-ATHN-03** | Testing for Weak Lock Out Mechanism |

**Recurso:** [OWASP Testing Guide v4.2](https://owasp.org/www-project-web-security-testing-guide/)

---

## OWASP Cheat Sheets

Referencias rápidas para mitigación de cada vulnerabilidad:

- [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
