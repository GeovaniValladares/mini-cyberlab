---
title: Mitigación de Vulnerabilidades
description: Guía de mitigación y código seguro para ULS CyberLab
sidebar:
  order: 31
---

# Mitigación de Vulnerabilidades

Esta sección presenta el **código corregido** para cada vulnerabilidad de ULS CyberLab — ideal para la segunda parte del ejercicio: aprender a **defender**.

---

## Versión Segura del Login (Anti-SQLi)

### Código Original (Vulnerable)

```php
// index.php - VULNERABLE
$username = $_POST['username'];
$password = $_POST['password'];

$query = "SELECT id, username, role FROM users 
          WHERE username = '$username' AND password = '$password'";
$result = $conn->query($query);
```

### Código Corregido

```php
// index.php - SEGURO
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Validación básica de input
if (empty($username) || empty($password)) {
    $error = "Usuario y contraseña son requeridos";
    goto show_form;
}

if (strlen($username) > 50 || strlen($password) > 255) {
    $error = "Datos inválidos";
    goto show_form;
}

// Prepared statement - separa código de datos
$stmt = $conn->prepare(
    "SELECT id, username, role, password_hash 
     FROM users 
     WHERE username = ?"
);
$stmt->bind_param("s", $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// Verificar contraseña con hash (no comparación directa)
if ($user && password_verify($password, $user['password_hash'])) {
    // Login exitoso
    session_regenerate_id(true);  // Prevenir session fixation
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['role'] = $user['role'];
    header("Location: dashboard.php");
    exit;
} else {
    // Mismo tiempo de respuesta para evitar timing attacks
    password_verify('dummy', '$2y$10$invalid_hash_to_waste_time_xxxxxxxxx');
    $error = "Credenciales incorrectas";
}
```

---

## Versión Segura de la Búsqueda SQLi (Módulo sqli.php)

```php
// SEGURO - Búsqueda con prepared statement
$search = trim($_GET['search'] ?? '');

// Validar que no esté vacío
if (empty($search)) {
    $results = [];
} else {
    $stmt = $conn->prepare(
        "SELECT id, secret_name FROM secrets 
         WHERE secret_name LIKE ?"
    );
    $search_param = '%' . $search . '%';
    $stmt->bind_param("s", $search_param);
    $stmt->execute();
    $results = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
}

// Output escapado
echo htmlspecialchars($search, ENT_QUOTES, 'UTF-8');
foreach ($results as $row) {
    echo htmlspecialchars($row['secret_name'], ENT_QUOTES, 'UTF-8');
}
```

---

## Versión Segura de XSS (Módulo xss.php)

### Reflected XSS Fix

```php
// SEGURO - Escapar siempre antes de mostrar
$search_term = $_GET['q'] ?? '';

// El escape ocurre justo antes de insertar en HTML
echo "Resultados para: " . htmlspecialchars($search_term, ENT_QUOTES, 'UTF-8');
```

### Stored XSS Fix

```php
// SEGURO - Escapar en el renderizado, no en el almacenamiento
// (La BD guarda el dato original para no corromper datos)

// Al mostrar comentarios:
foreach ($comments as $comment) {
    // htmlspecialchars convierte < > " ' & en entidades HTML
    echo '<div class="comment">' . 
         htmlspecialchars($comment['comment'], ENT_QUOTES, 'UTF-8') . 
         '</div>';
}
```

### CSP Header para XSS

```php
// Agregar al inicio de cada página
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
header("X-Content-Type-Options: nosniff");
```

---

## Versión Segura del Upload (Módulo upload.php)

```php
// SEGURO - Validación completa de uploads

function upload_file_secure($file) {
    // 1. Verificar errores de upload
    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Error en la subida del archivo");
    }
    
    // 2. Verificar tamaño
    $max_size = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $max_size) {
        throw new Exception("Archivo demasiado grande (máx 5MB)");
    }
    
    // 3. Whitelist de extensiones
    $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt', 'doc', 'docx'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed_ext)) {
        throw new Exception("Tipo de archivo no permitido: .$ext");
    }
    
    // 4. Verificar tipo MIME real (magic bytes)
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    $allowed_mimes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf', 'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!in_array($mime, $allowed_mimes)) {
        throw new Exception("Tipo MIME no permitido: $mime");
    }
    
    // 5. Generar nombre seguro (elimina el nombre original del atacante)
    $safe_name = bin2hex(random_bytes(16)) . '.' . $ext;
    
    // 6. Almacenar FUERA del webroot
    $upload_dir = dirname(__DIR__) . '/private_uploads/';  // Fuera de htdocs
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0750, true);
    }
    
    move_uploaded_file($file['tmp_name'], $upload_dir . $safe_name);
    
    return $safe_name;
}

// Si DEBES almacenar dentro del webroot, usa .htaccess:
// uploads/.htaccess:
// php_flag engine off
// <FilesMatch "\.php">
//   Require all denied
// </FilesMatch>
```

---

## Versión Segura del Brute Force (Módulo bruteforce.php)

```php
// SEGURO - Rate limiting + CAPTCHA + hashing

class RateLimiter {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    public function check(string $ip, string $action, int $max = 5, int $window = 900): bool {
        // Limpiar intentos viejos
        $stmt = $this->conn->prepare(
            "DELETE FROM rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL ? SECOND)"
        );
        $stmt->bind_param("i", $window);
        $stmt->execute();
        
        // Contar intentos recientes
        $stmt = $this->conn->prepare(
            "SELECT COUNT(*) as attempts FROM rate_limits 
             WHERE ip = ? AND action = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND)"
        );
        $stmt->bind_param("ssi", $ip, $action, $window);
        $stmt->execute();
        $count = $stmt->get_result()->fetch_assoc()['attempts'];
        
        if ($count >= $max) {
            return false; // Bloqueado
        }
        
        // Registrar intento
        $stmt = $this->conn->prepare("INSERT INTO rate_limits (ip, action) VALUES (?, ?)");
        $stmt->bind_param("ss", $ip, $action);
        $stmt->execute();
        
        return true; // Permitido
    }
}

// Uso en el formulario de login
$ip = $_SERVER['REMOTE_ADDR'];
$limiter = new RateLimiter($conn);

if (!$limiter->check($ip, 'login', 5, 900)) {
    http_response_code(429);
    die("Demasiados intentos. Espera 15 minutos.");
}

// Verificar con hash
$stmt = $conn->prepare("SELECT id, password_hash FROM users WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

if ($user && password_verify($password, $user['password_hash'])) {
    // Login exitoso
    session_regenerate_id(true);
} else {
    // Fallo — el rate limiter ya registró el intento
    $error = "Credenciales incorrectas";
}
```

---

## Checklist de Seguridad para Desarrolladores PHP

```
AUTENTICACIÓN
□ Usar prepared statements en todas las queries de login
□ Hashear contraseñas con password_hash() (Argon2id o bcrypt)
□ Implementar rate limiting (máximo 5 intentos por 15 minutos)
□ Usar session_regenerate_id() después del login
□ Implementar timeout de sesión
□ Considerar MFA para cuentas privilegiadas

OUTPUT
□ Usar htmlspecialchars() en TODA salida HTML
□ Usar json_encode() para datos en contexto JavaScript
□ Usar urlencode() para datos en URLs
□ Nunca usar strip_tags() como única defensa contra XSS

FILE UPLOAD
□ Whitelist de extensiones (no blacklist)
□ Verificar tipo MIME real (finfo)
□ Renombrar archivos al guardar
□ Almacenar fuera del webroot si es posible
□ Limitar tamaño de archivos
□ Desactivar ejecución PHP en directorio de uploads

HEADERS HTTP
□ Content-Security-Policy
□ X-Content-Type-Options: nosniff
□ X-Frame-Options: DENY
□ Strict-Transport-Security (en HTTPS)

BASE DE DATOS
□ Prepared statements en TODAS las queries
□ Usuario de BD con mínimos privilegios
□ No almacenar contraseñas en texto plano
□ Cifrar datos sensibles en reposo

LOGGING
□ Registrar intentos de login fallidos
□ Registrar errores de aplicación
□ NO registrar contraseñas ni datos sensibles
□ Alertas automáticas para eventos críticos
```
