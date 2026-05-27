---
title: Brute Force
description: Teoría sobre ataques de fuerza bruta - Marco Teórico ULS CyberLab
sidebar:
  order: 14
---

# Brute Force (Fuerza Bruta)

## ¿Qué es Brute Force?

Un **ataque de fuerza bruta** es una técnica de ataque donde el atacante prueba sistemáticamente todas las combinaciones posibles de contraseñas, claves o datos hasta encontrar la correcta. Es el ataque más simple conceptualmente pero puede ser devastador contra sistemas sin protecciones adecuadas.

```
Ataque de diccionario:
  [password123] → Incorrecto
  [qwerty]      → Incorrecto  
  [admin123]    → Incorrecto
  [qwerty]      → ✅ CORRECTO → Acceso obtenido
       ↑
  Lista de contraseñas comunes (wordlist)
```

---

## Tipos de Ataques de Contraseñas

### 1. Brute Force Puro
Prueba **todas las combinaciones posibles** de caracteres.

| Longitud | Caracteres | Combinaciones | Tiempo estimado* |
|----------|-----------|---------------|-----------------|
| 4 chars | a-z | 456,976 | Segundos |
| 6 chars | a-z | 308,915,776 | Minutos |
| 8 chars | a-z+0-9 | 2,821,109,907,456 | Días |
| 12 chars | a-Z+0-9+! | 475,920,314,814,253,376,475 | Siglos |

*Con 1,000,000 intentos/segundo

**Lección:** Las contraseñas largas y complejas son resistentes a brute force puro.

### 2. Dictionary Attack (Ataque de Diccionario)
El más común en práctica. Usa una lista de contraseñas conocidas:

- **rockyou.txt** — 14 millones de contraseñas reales filtradas en 2009
- **SecLists** — Colección de wordlists para pentesting
- **Contraseñas de filtraciones** — Bases de datos como HaveIBeenPwned

```bash
# La contraseña del usuario "ceo" en ULS CyberLab es: qwerty
# "qwerty" está en el puesto ~3 de cualquier wordlist
```

### 3. Credential Stuffing
Usar combinaciones usuario:contraseña filtradas de otras bases de datos. Funciona porque muchas personas **reusan contraseñas**.

```
Si se filtra LinkedIn con usuario@email.com:Password123
→ El atacante prueba esas mismas credenciales en Gmail, Facebook, etc.
```

### 4. Password Spraying
En lugar de probar muchas contraseñas para un usuario, se prueba **una contraseña común contra muchos usuarios**. Evita el bloqueo de cuentas por intentos fallidos.

```
admin:Password123    → Incorrecto
user1:Password123    → Incorrecto
john.doe:Password123 → ✅ CORRECTO
```

---

## ¿Por Qué Funciona el Brute Force?

### Factores que lo hacen posible:

1. **Sin límite de intentos** — El servidor no bloquea ni ralentiza
2. **Contraseñas débiles** — Los usuarios eligen contraseñas predecibles
3. **Automatización** — Las herramientas hacen miles de intentos por segundo
4. **Sin MFA** — Sin segundo factor de autenticación
5. **Credenciales por defecto** — admin/admin, admin/password, etc.

### En ULS CyberLab (Módulo Brute Force)

```php
// modules/bruteforce.php - Sin rate limiting
if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        // Login exitoso - captura la flag
        capture_flag('FLAG{BRUT3_F0RC3_K1NG}');
    }
    // ⚠️ No hay: sleep(), CAPTCHA, bloqueo de IP, límite de intentos
}
```

**El usuario `ceo`** tiene contraseña `qwerty` — está en cualquier wordlist básica.

---

## Herramientas de Brute Force

### Hydra

La herramienta más popular para ataques de autenticación en red:

```bash
# Sintaxis básica
hydra [opciones] [target] [servicio] [parámetros]

# Para ULS CyberLab
hydra -l ceo -P /usr/share/wordlists/rockyou.txt localhost \
  http-post-form \
  "/mini-cyberlab/modules/bruteforce.php:username=^USER^&password=^PASS^:Credenciales incorrectas" \
  -V -t 5

# Explicación de parámetros:
# -l ceo                     → Usuario objetivo (login único)
# -L users.txt               → Lista de usuarios (para múltiples)
# -P rockyou.txt             → Wordlist de contraseñas
# localhost                  → Host objetivo
# http-post-form             → Módulo para formularios POST
# "/path:params:fail_string" → URL, parámetros, mensaje de fallo
# -V                         → Mostrar cada intento
# -t 5                       → 5 hilos paralelos (cuidado con DoS)
```

### Burp Suite Intruder

Interfaz gráfica para ataques de fuerza bruta:

```
1. Proxy → Interceptar login de ULS CyberLab
2. Click derecho → Send to Intruder
3. Intruder → Positions
4. Seleccionar el campo "password" → Add §
5. Payloads → Payload Sets
   - Payload type: Simple list
   - Cargar wordlist
6. Start Attack
7. Ordenar por Status Code (200) o Length
```

### Medusa

Alternativa a Hydra:

```bash
medusa -h localhost -u ceo -P wordlist.txt \
  -M http -m "POST /mini-cyberlab/modules/bruteforce.php" \
  -m "FORM:username=ceo&password=WORD" \
  -m "DENY:Credenciales incorrectas"
```

---

## Wordlists Populares

| Wordlist | Contraseñas | Descripción |
|----------|------------|-------------|
| **rockyou.txt** | 14.3M | La más usada, de la filtración de RockYou (2009) |
| **common-passwords.txt** | 10K | Las 10,000 más comunes |
| **darkweb2017-top10000.txt** | 10K | Del Dark Web |
| **SecLists/Passwords/** | Varios | Colección de SecLists en GitHub |

**Contraseñas en el Top 20 de todas las listas:**
```
123456, password, 123456789, 12345, 12345678,
qwerty, 1234567, 111111, 1234567890, 123123,
abc123, qwerty123, 1q2w3e4r, admin, password1,
iloveyou, 1234, monkey, dragon, master
```

La contraseña `qwerty` del usuario `ceo` está en posición **#6** de rockyou.txt.

---

## Detección y Métricas en ULS CyberLab

El módulo brute force muestra:

```php
// Cuenta intentos en los últimos 5 minutos
$stmt = $conn->prepare(
    "SELECT COUNT(*) as attempts 
     FROM security_logs 
     WHERE module = 'bruteforce' 
     AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)"
);
```

Esto demuestra cómo un sistema de monitoreo podría detectar un ataque — aunque en este caso **no toma acción** (sin bloqueo), lo que es la vulnerabilidad.

---

## Mitigación

### ✅ Rate Limiting (Límite de velocidad)

```php
// Máximo 5 intentos por IP en 15 minutos
session_start();
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['lockout_time'] = 0;
}

// Verificar si está bloqueado
if (time() < $_SESSION['lockout_time']) {
    $wait = ceil(($_SESSION['lockout_time'] - time()) / 60);
    die("Cuenta bloqueada. Intenta en $wait minutos.");
}

// Incrementar contador
$_SESSION['login_attempts']++;

if ($_SESSION['login_attempts'] >= 5) {
    $_SESSION['lockout_time'] = time() + (15 * 60); // 15 minutos
    die("Demasiados intentos. Bloqueado por 15 minutos.");
}
```

### ✅ CAPTCHA

```html
<!-- Google reCAPTCHA v3 -->
<script src="https://www.google.com/recaptcha/api.js"></script>
<form>
  <div class="g-recaptcha" data-sitekey="TU_SITE_KEY"></div>
  <button type="submit">Login</button>
</form>
```

### ✅ Multi-Factor Authentication (MFA)

```
Contraseña + [SMS/App de Authenticator/Email]
↑ Incluso si adivinan la contraseña, necesitan el segundo factor
```

### ✅ Contraseñas Robustas

```php
// Validar requisitos mínimos de contraseña
function validar_password($pass) {
    return strlen($pass) >= 12 &&           // 12+ caracteres
           preg_match('/[A-Z]/', $pass) &&   // Mayúscula
           preg_match('/[a-z]/', $pass) &&   // Minúscula
           preg_match('/[0-9]/', $pass) &&   // Número
           preg_match('/[^a-zA-Z0-9]/', $pass); // Símbolo
}
```

### ✅ Alertas de Seguridad

```php
// Notificar al administrador cuando hay muchos intentos fallidos
if ($failed_attempts > 10) {
    mail('admin@empresa.com', 
         'Posible ataque de fuerza bruta',
         "IP: {$_SERVER['REMOTE_ADDR']} ha tenido $failed_attempts intentos fallidos");
}
```

### ✅ IP Banning

```php
// Lista de IPs bloqueadas en BD
$blocked_ips = get_blocked_ips();
if (in_array($_SERVER['REMOTE_ADDR'], $blocked_ips)) {
    http_response_code(403);
    die("Acceso denegado");
}
```

---

## Recursos

- [Hydra GitHub](https://github.com/vanhauser-thc/thc-hydra)
- [SecLists - Wordlists](https://github.com/danielmiessler/SecLists)
- [HaveIBeenPwned](https://haveibeenpwned.com/) — Verificar si tu email fue comprometido
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
