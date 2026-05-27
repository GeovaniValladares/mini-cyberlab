---
title: Consejos de Seguridad
description: Consejos prácticos de seguridad informática derivados de ULS CyberLab
sidebar:
  order: 30
---

# Consejos de Seguridad

## Para Desarrolladores

Cada vulnerabilidad de ULS CyberLab tiene una lección directa para el desarrollo seguro:

---

### 🛡️ Consejo #1: Nunca Confíes en la Entrada del Usuario

> *"All input is evil until proven otherwise."* — Michael Howard, Microsoft

**Principio fundamental:** Toda entrada del usuario debe considerarse hostil hasta que se valide y sanitice correctamente.

```php
// ❌ NUNCA hagas esto
$id = $_GET['id'];
$result = $conn->query("SELECT * FROM users WHERE id = $id");

// ✅ SIEMPRE valida y usa prepared statements
$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id) die("ID inválido");

$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
```

**Aplica a:**
- Parámetros GET y POST
- Cookies
- Headers HTTP
- Archivos subidos
- Datos de APIs externas
- Archivos de configuración cargados por usuarios

---

### 🛡️ Consejo #2: Usa Prepared Statements SIEMPRE

La concatenación de strings en queries SQL es **siempre incorrecta**, sin excepciones:

```php
// ❌ VULNERABLE - Nunca hagas esto
$query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'";

// ✅ CORRECTO - Prepared Statements
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $_POST['email']);
$stmt->execute();
```

**Regla de oro:** Si tu query SQL tiene algún valor que proviene de fuera de tu código PHP directamente concatenado, **es vulnerable**.

---

### 🛡️ Consejo #3: Escapa el Output para el Contexto Correcto

El XSS ocurre por no escapar correctamente el output **para el contexto donde se usa**:

```php
// ❌ VULNERABLE - Output directo
echo $user_comment;

// ✅ Para HTML
echo htmlspecialchars($data, ENT_QUOTES, 'UTF-8');

// ✅ Para atributo HTML
echo htmlspecialchars($data, ENT_QUOTES | ENT_HTML5, 'UTF-8');

// ✅ Para JavaScript
echo json_encode($data);  // Nunca concatenes directamente en JS

// ✅ Para URL
echo urlencode($data);
```

**Regla:** El escape debe hacerse **justo antes de usar el dato**, no en el momento de recibirlo.

---

### 🛡️ Consejo #4: Hashea las Contraseñas con Algoritmos Modernos

```php
// ❌ NUNCA guardes contraseñas en texto plano
$password = $_POST['password'];  // NO

// ❌ NUNCA uses MD5 o SHA1 para contraseñas
$hash = md5($password);          // NO — son rápidos y vulnerables
$hash = sha1($password);         // NO

// ✅ USA password_hash con Argon2id o bcrypt
$hash = password_hash($password, PASSWORD_ARGON2ID);  // Mejor opción
$hash = password_hash($password, PASSWORD_BCRYPT);    // Opción aceptable

// ✅ VERIFICA con password_verify
if (password_verify($input_password, $stored_hash)) {
    // Login exitoso
}
```

---

### 🛡️ Consejo #5: Valida y Restringe los Uploads de Archivos

```php
// ✅ Guía completa para uploads seguros

// 1. Verificar extensión (whitelist, no blacklist)
$allowed_ext = ['jpg', 'png', 'gif', 'pdf'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed_ext)) {
    die("Extensión no permitida");
}

// 2. Verificar tipo MIME real
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($_FILES['file']['tmp_name']);
$allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
if (!in_array($mime, $allowed_mimes)) {
    die("Tipo de archivo no permitido");
}

// 3. Limitar tamaño
if ($_FILES['file']['size'] > 5 * 1024 * 1024) {  // 5MB
    die("Archivo demasiado grande");
}

// 4. Renombrar el archivo
$safe_name = bin2hex(random_bytes(16)) . '.' . $ext;

// 5. Almacenar FUERA del webroot
move_uploaded_file($_FILES['file']['tmp_name'], '/var/uploads/' . $safe_name);
```

---

### 🛡️ Consejo #6: Implementa Rate Limiting

Sin límite de intentos, cualquier sistema de autenticación es vulnerable al brute force:

```php
// Implementación básica con sesiones
function check_rate_limit($action, $max_attempts = 5, $lockout_minutes = 15) {
    $key = "rate_limit_{$action}";
    
    if (!isset($_SESSION[$key])) {
        $_SESSION[$key] = ['attempts' => 0, 'lockout_until' => 0];
    }
    
    $rl = &$_SESSION[$key];
    
    // Verificar bloqueo activo
    if (time() < $rl['lockout_until']) {
        $wait = ceil(($rl['lockout_until'] - time()) / 60);
        throw new Exception("Bloqueado por $wait minutos más");
    }
    
    // Incrementar contador
    $rl['attempts']++;
    
    // Aplicar bloqueo si se supera el límite
    if ($rl['attempts'] >= $max_attempts) {
        $rl['lockout_until'] = time() + ($lockout_minutes * 60);
        $rl['attempts'] = 0;
        throw new Exception("Demasiados intentos. Bloqueado $lockout_minutes minutos.");
    }
}

// Uso
try {
    check_rate_limit('login');
    // ... procesar login
} catch (Exception $e) {
    echo $e->getMessage();
}
```

---

### 🛡️ Consejo #7: Implementa Logging de Seguridad

```php
// ✅ Un buen sistema de logging registra:
function log_security_event($level, $action, $user_id = null, $details = []) {
    $entry = [
        'timestamp'  => date('c'),
        'level'      => $level,      // INFO, WARNING, CRITICAL
        'action'     => $action,
        'user_id'    => $user_id,
        'ip'         => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'],
        'details'    => $details,
    ];
    
    // Guardar en BD, archivo de logs, SIEM, etc.
    error_log(json_encode($entry), 3, '/var/log/app/security.log');
}

// Eventos importantes a registrar:
log_security_event('CRITICAL', 'sqli_detected', null, ['input' => $username]);
log_security_event('WARNING', 'login_failed', null, ['username' => $username]);
log_security_event('CRITICAL', 'xss_detected', null, ['input' => $comment]);
log_security_event('CRITICAL', 'php_upload', $_SESSION['user_id'], ['file' => $filename]);
```

---

### 🛡️ Consejo #8: Content Security Policy (CSP)

```php
// ✅ Agrega CSP headers para mitigar XSS
header("Content-Security-Policy: " . implode('; ', [
    "default-src 'self'",
    "script-src 'self'",        // Solo scripts del mismo dominio
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",   // Previene clickjacking
    "base-uri 'self'",
]));

// Otros headers de seguridad importantes
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
```

---

### 🛡️ Consejo #9: Principio de Mínimo Privilegio

> Cada componente del sistema debe tener solo los permisos mínimos necesarios para funcionar.

```sql
-- ❌ MALO: Aplicación con privilegios de super-usuario
-- GRANT ALL PRIVILEGES ON *.* TO 'app'@'localhost';

-- ✅ CORRECTO: Solo los permisos necesarios
CREATE USER 'app_readonly'@'localhost' IDENTIFIED BY 'strong_pass';
GRANT SELECT ON mydb.users TO 'app_readonly'@'localhost';
GRANT SELECT ON mydb.products TO 'app_readonly'@'localhost';

CREATE USER 'app_write'@'localhost' IDENTIFIED BY 'another_strong_pass';
GRANT SELECT, INSERT, UPDATE ON mydb.orders TO 'app_write'@'localhost';
```

```php
// ❌ Ejecutar como root del sistema
// shell_exec('rm -rf /tmp/' . $file);  // ¿Y si $file es '../etc/passwd'?

// ✅ Validar y limitar el scope de operaciones
$safe_file = basename($file);  // Solo el nombre del archivo
$allowed_dir = '/var/uploads/';
unlink($allowed_dir . $safe_file);
```

---

### 🛡️ Consejo #10: Mantén las Dependencias Actualizadas

```bash
# PHP con Composer
composer audit          # Ver vulnerabilidades conocidas
composer update         # Actualizar dependencias

# Node.js con npm
npm audit               # Auditar vulnerabilidades
npm audit fix           # Reparar automáticamente

# Python con pip
pip install pip-audit
pip-audit               # Auditar paquetes Python

# Revisa periódicamente:
# - CVE Database: https://cve.mitre.org/
# - NVD: https://nvd.nist.gov/
# - XAMPP / PHP release notes para actualizaciones
```

---

## Consejos para Usar ULS CyberLab de Forma Ética

1. **Solo en localhost o redes de lab aisladas** — nunca en internet
2. **No expongas el servidor** en redes públicas o corporativas
3. **Usa los ataques para aprender** — no para hacerte de más privilegios de los del laboratorio
4. **Reporta problemas** si encuentras algo fuera del scope del proyecto
5. **Limpia tus comentarios XSS** después de practicar para no afectar a otros estudiantes
6. **No subas archivos maliciosos reales** — usa solo los ejemplos del laboratorio
7. **No abuses del sistema de puntos** — compite limpiamente

---

## Regla de Oro

> **"Con gran poder viene gran responsabilidad."**  
> — Tío Ben, Spider-Man (y todo instructor de seguridad informática)

El conocimiento que obtienes en ULS CyberLab te hace más capaz de **proteger** sistemas. Úsalo para bien. El hacking no autorizado es un **delito** en El Salvador y en todo el mundo.
