---
title: Instalación
description: Guía paso a paso para instalar ULS CyberLab
sidebar:
  order: 6
---

# Guía de Instalación

## Prerrequisitos

Antes de instalar, asegúrate de tener:
- ✅ XAMPP instalado (versión 8.x recomendada)
- ✅ Acceso de administrador en tu PC
- ✅ Los archivos del proyecto `mini-cyberlab/`

---

## Paso 1: Instalar XAMPP

Si aún no tienes XAMPP:

1. Descarga desde: [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Selecciona el instalador para tu SO (Windows/Linux/Mac)
3. Ejecuta como administrador
4. Instala en la ruta por defecto: `C:\xampp\` (Windows)
5. Selecciona componentes: **Apache**, **MySQL**, **PHP** (mínimos)

---

## Paso 2: Copiar el Proyecto

### En Windows
```powershell
# Copia la carpeta del proyecto al directorio web de XAMPP
Copy-Item -Recurse ".\mini-cyberlab" "C:\xampp\htdocs\mini-cyberlab"
```

O manualmente: copia la carpeta `mini-cyberlab/` a `C:\xampp\htdocs\`

### En Linux/Mac
```bash
cp -r mini-cyberlab/ /opt/lampp/htdocs/mini-cyberlab/
# O si usas XAMPP para Linux:
sudo cp -r mini-cyberlab/ /opt/lampp/htdocs/
```

**Estructura final esperada:**
```
C:\xampp\htdocs\mini-cyberlab\
├── index.php
├── dashboard.php
├── modules/
├── api/
├── includes/
├── assets/
└── sql/setup.sql   ← Necesitarás este archivo
```

---

## Paso 3: Iniciar XAMPP

1. Abre **XAMPP Control Panel**
2. Haz clic en **Start** en Apache
3. Haz clic en **Start** en MySQL
4. Ambos servicios deben mostrar fondo **verde**

```
Apache    [Start] [Admin] [Config] [Log]   ← Verde = corriendo
MySQL     [Start] [Admin] [Config] [Log]   ← Verde = corriendo
```

---

## Paso 4: Crear la Base de Datos

### Usando phpMyAdmin (Recomendado)

1. Abre: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. Haz clic en **"Nueva"** en el panel izquierdo
3. Escribe el nombre: `uls_cyberlab`
4. Selecciona cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en **Crear**

### Importar el Schema

1. Con la DB `uls_cyberlab` seleccionada, haz clic en **Importar**
2. Haz clic en **"Elegir archivo"**
3. Navega a: `C:\xampp\htdocs\mini-cyberlab\sql\setup.sql`
4. Haz clic en **Continuar**
5. Debes ver: **"Se importó correctamente 1 archivo"**

### Alternativa: Línea de Comandos

```bash
# Windows (XAMPP)
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE uls_cyberlab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
C:\xampp\mysql\bin\mysql.exe -u root uls_cyberlab < C:\xampp\htdocs\mini-cyberlab\sql\setup.sql

# Linux
mysql -u root -e "CREATE DATABASE uls_cyberlab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root uls_cyberlab < /opt/lampp/htdocs/mini-cyberlab/sql/setup.sql
```

---

## Paso 5: Verificar la Instalación

Abre en tu navegador:

```
http://localhost/mini-cyberlab/
```

Deberías ver la **pantalla de login** de ULS CyberLab.

### Prueba de Login

Intenta iniciar sesión con:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `password` | Administrador |
| `estudiante` | `password` | Estudiante |
| `root` | `toor` | Administrador |
| `invitado` | `12345` | Estudiante |

Si el login funciona y ves el dashboard → **¡Instalación exitosa!** 🎉

---

## Paso 6: Crear Carpeta de Uploads (Opcional)

El módulo de File Upload necesita la carpeta `uploads/`:

```powershell
# Windows
New-Item -ItemType Directory -Path "C:\xampp\htdocs\mini-cyberlab\uploads"

# Linux
mkdir /opt/lampp/htdocs/mini-cyberlab/uploads
chmod 777 /opt/lampp/htdocs/mini-cyberlab/uploads
```

:::note
Si no creas esta carpeta, se generará automáticamente en el primer intento de subida de archivo en el Lab 3.
:::

---

## Solución de Problemas

### Error: "No se puede conectar a MySQL"

```php
// Verifica las credenciales en includes/db.php
$host = 'localhost';
$user = 'root';
$pass = '';           // XAMPP default: vacío
$dbname = 'uls_cyberlab';
```

**Soluciones:**
1. Verifica que MySQL esté corriendo en XAMPP Control Panel
2. Si cambiaste la contraseña de root, actualiza `includes/db.php`
3. Verifica que la base de datos `uls_cyberlab` existe en phpMyAdmin

### Error: "Access denied for user 'root'"

Cambia la contraseña de root en phpMyAdmin o usa el usuario que hayas configurado:

```sql
-- En phpMyAdmin → SQL
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
```

### Error 404 al acceder a módulos

Verifica que:
1. Apache esté corriendo
2. La carpeta esté en `C:\xampp\htdocs\mini-cyberlab\` (nombre exacto)
3. Todos los archivos PHP estén presentes

### La página carga pero no hay datos en el dashboard

Verifica que importaste correctamente `sql/setup.sql`:
1. Abre phpMyAdmin
2. Selecciona `uls_cyberlab`
3. Verifica que existan las tablas: `users`, `flags`, `security_logs`, `comments`, `secrets`, `captured_flags`

### Los uploads no funcionan

```powershell
# Windows: Permisos en la carpeta uploads
icacls "C:\xampp\htdocs\mini-cyberlab\uploads" /grant Everyone:(OI)(CI)F
```

---

## Configuración para Red Local (Laboratorio en Grupo)

Si quieres que otros estudiantes en la red accedan al servidor:

### En Windows con Firewall
```powershell
# Abrir puerto 80 en Windows Firewall
netsh advfirewall firewall add rule name="XAMPP Apache" dir=in action=allow protocol=TCP localport=80
```

### Encontrar tu IP
```powershell
ipconfig | findstr "IPv4"
# Ejemplo: 192.168.1.150
```

### Los demás estudiantes acceden vía:
```
http://192.168.1.150/mini-cyberlab/
```

:::caution
Recuerda: esto solo debe hacerse en **redes de laboratorio aisladas**. NUNCA en redes con acceso a internet.
:::
