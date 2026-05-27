---
title: Requerimientos
description: Requisitos del sistema para ULS CyberLab
sidebar:
  order: 5
---

# Requerimientos del Sistema

## Requerimientos de Hardware

### Mínimos
| Componente | Especificación Mínima |
|------------|----------------------|
| **CPU** | Intel/AMD x64 de 2 núcleos |
| **RAM** | 4 GB |
| **Almacenamiento** | 500 MB libres (XAMPP + proyecto) |
| **Red** | Interfaz loopback (localhost) |

### Recomendados
| Componente | Especificación Recomendada |
|------------|---------------------------|
| **CPU** | Intel/AMD x64 de 4+ núcleos |
| **RAM** | 8 GB |
| **Almacenamiento** | 2 GB libres (para archivos subidos en labs) |
| **Red** | Red LAN para laboratorio en grupo |

---

## Requerimientos de Software

### Obligatorios

| Software | Versión | Descripción |
|----------|---------|-------------|
| **XAMPP** | 8.x o superior | Apache + MySQL + PHP en un paquete |
| **PHP** | 8.0+ | Backend de la aplicación |
| **Apache** | 2.4+ | Servidor web (incluido en XAMPP) |
| **MySQL/MariaDB** | 5.7+ / 10.4+ | Base de datos (incluido en XAMPP) |
| **Navegador web** | Cualquier moderno | Chrome, Firefox, Edge, Brave |

### Opcionales (para laboratorios avanzados)

| Software | Uso en Lab | Plataforma |
|----------|-----------|------------|
| **Burp Suite Community** | Interceptar peticiones HTTP, Brute Force con Intruder | Windows/Linux/Mac |
| **Hydra** | Ataques de fuerza bruta desde CLI | Kali Linux |
| **Kali Linux** | Herramientas completas de ethical hacking | VM/Dual boot |
| **VirtualBox / VMware** | Para aislar Kali Linux del host | Windows/Mac |

---

## Compatibilidad de Sistema Operativo

| Sistema Operativo | Soporte | Notas |
|-------------------|---------|-------|
| **Windows 10/11** | ✅ Completo | XAMPP nativo, sin configuración extra |
| **Windows 7/8** | ⚠️ Parcial | XAMPP funciona, PHP 8.x puede tener problemas |
| **Ubuntu 20.04+** | ✅ Completo | LAMP stack o XAMPP para Linux |
| **Debian 11+** | ✅ Completo | LAMP stack o XAMPP para Linux |
| **Kali Linux** | ✅ Completo | LAMP o Apache2 + PHP + MariaDB |
| **macOS 12+** | ✅ Completo | XAMPP para Mac |
| **macOS < 12** | ⚠️ Parcial | MAMP como alternativa |

---

## Requerimientos de Red

### Para uso individual (localhost)
```
No se requiere configuración de red.
Solo tener XAMPP corriendo.
Acceso: http://localhost/mini-cyberlab/
```

### Para laboratorio en grupo (red LAN)
```
1. Servidor: PC con XAMPP corriendo el proyecto
2. Firewall: Abrir puerto 80 en el servidor
3. Clientes: Acceso mediante IP del servidor
   Ejemplo: http://192.168.1.100/mini-cyberlab/
4. MySQL: Solo acceso local (no exponer puerto 3306)
```

:::caution[⚠️ ADVERTENCIA DE SEGURIDAD]
**NUNCA exponer este proyecto a Internet.** Las vulnerabilidades son intencionales y cualquier persona con acceso podría:
- Obtener acceso al servidor via webshell
- Extraer datos de la base de datos
- Ejecutar comandos en el servidor

Use **exclusivamente** en `localhost` o en redes de laboratorio completamente aisladas.
:::

---

## Requerimientos de la Base de Datos

### Credenciales por Defecto de XAMPP
```
Host:     localhost
Usuario:  root
Password: (vacío)
Puerto:   3306
```

### Base de Datos del Proyecto
```sql
Nombre: uls_cyberlab
Charset: utf8mb4
Collation: utf8mb4_unicode_ci
```

### Permisos Necesarios
```sql
-- El usuario root (default XAMPP) tiene todos los permisos
-- Si usa otro usuario:
GRANT SELECT, INSERT, UPDATE, DELETE ON uls_cyberlab.* TO 'tu_usuario'@'localhost';
```

---

## Requerimientos de PHP

### Extensiones Necesarias

| Extensión | Propósito | Estado en XAMPP |
|-----------|-----------|-----------------|
| `mysqli` | Conexión a MySQL | ✅ Habilitada por defecto |
| `session` | Manejo de sesiones | ✅ Habilitada por defecto |
| `json` | APIs JSON | ✅ Habilitada por defecto |
| `fileinfo` | Upload de archivos | ✅ Habilitada por defecto |

### Configuración de php.ini relevante
```ini
; Necesario para file upload (Lab 3)
file_uploads = On
upload_max_filesize = 8M
post_max_size = 8M

; Para sessions
session.save_handler = files
session.use_cookies = 1

; Display errors (solo en desarrollo)
display_errors = On
error_reporting = E_ALL
```

---

## Verificación de Requerimientos

Puedes verificar tu instalación con este script PHP:

```php
<?php
// Guarda como: check.php en el directorio de XAMPP
echo "PHP Version: " . PHP_VERSION . "<br>";
echo "MySQLi: " . (extension_loaded('mysqli') ? '✅' : '❌') . "<br>";
echo "Sessions: " . (extension_loaded('session') ? '✅' : '❌') . "<br>";
echo "JSON: " . (extension_loaded('json') ? '✅' : '❌') . "<br>";
echo "File Uploads: " . (ini_get('file_uploads') ? '✅' : '❌') . "<br>";

// Test conexión MySQL
$conn = new mysqli('localhost', 'root', '', 'uls_cyberlab');
if ($conn->connect_error) {
    echo "MySQL: ❌ " . $conn->connect_error;
} else {
    echo "MySQL: ✅ Conectado a uls_cyberlab";
}
?>
```

---

## Resumen de Instalación Rápida

```
1. Instala XAMPP desde https://www.apachefriends.org/
2. Inicia Apache y MySQL desde XAMPP Control Panel
3. Copia mini-cyberlab/ a C:\xampp\htdocs\
4. Abre phpMyAdmin: http://localhost/phpmyadmin
5. Crea DB "uls_cyberlab" e importa sql/setup.sql
6. Abre http://localhost/mini-cyberlab/
7. Login con admin/password
```

→ Ver [guía completa de instalación](/instalacion/)
