---
title: Glosario
description: Glosario de términos de ciberseguridad usados en ULS CyberLab
sidebar:
  order: 45
---

# Glosario de Términos

Referencia rápida de los términos técnicos usados en ULS CyberLab y en ciberseguridad en general.

---

## A

**Apache** — Servidor web de código abierto. Es el componente 'A' de XAMPP que sirve los archivos PHP de ULS CyberLab.

**AJAX** — Asynchronous JavaScript and XML. Técnica para hacer peticiones HTTP desde JavaScript sin recargar la página. Usada en el dashboard para el feed de logs en tiempo real.

**Authentication (Autenticación)** — Proceso de verificar la identidad de un usuario. ULS CyberLab usa sesiones PHP para esto.

**Authorization (Autorización)** — Proceso de determinar qué puede hacer un usuario autenticado. Diferente a autenticación.

---

## B

**Backdoor** — Acceso oculto a un sistema, instalado por un atacante para mantener acceso persistente. Los webshells actúan como backdoors temporales.

**Brute Force** — Ataque que prueba sistemáticamente todas las combinaciones posibles de contraseñas hasta encontrar la correcta.

**Bug Bounty** — Programa donde empresas pagan a investigadores de seguridad por reportar vulnerabilidades responsablemente.

**Burp Suite** — Herramienta de testing web que actúa como proxy HTTP, permitiendo interceptar y modificar peticiones.

---

## C

**CAPTCHA** — Completely Automated Public Turing test to tell Computers and Humans Apart. Desafío diseñado para bloquear bots automatizados.

**CIA Triad** — Confidencialidad, Integridad y Disponibilidad. Los tres pilares fundamentales de la seguridad informática.

**Cookie** — Pequeño archivo de datos almacenado en el navegador. PHPSESSID es la cookie de sesión de PHP.

**CSRF (Cross-Site Request Forgery)** — Ataque que fuerza al navegador de una víctima autenticada a ejecutar acciones no deseadas. No implementado en ULS CyberLab.

**CTF (Capture The Flag)** — Competencia de ciberseguridad donde se capturan "banderas" (strings especiales) al resolver retos.

**CVE** — Common Vulnerabilities and Exposures. Sistema de identificación de vulnerabilidades conocidas (ej: CVE-2021-44228).

---

## D

**Dashboard** — Panel de control. En ULS CyberLab muestra estadísticas, logs y el scoreboard.

**DVWA** — Damn Vulnerable Web Application. Plataforma de práctica de seguridad web similar a ULS CyberLab.

**Dictionary Attack (Ataque de Diccionario)** — Variante del brute force que usa listas predefinidas de contraseñas comunes en lugar de probar todas las combinaciones.

---

## E

**Encoding** — Transformación de datos a un formato diferente. Diferente de cifrado — no oculta el contenido. Ej: Base64, URL encoding, HTML entities.

**Ethical Hacking** — Aplicar técnicas de hacking con autorización explícita para mejorar la seguridad.

**Exploit** — Código o técnica que aprovecha una vulnerabilidad para lograr un efecto no deseado en el sistema.

---

## F

**Flag** — En CTF, una cadena de texto especial que demuestra que se completó un reto. Formato en ULS CyberLab: `FLAG{texto_aqui}`.

---

## H

**Hashing** — Función matemática one-way que convierte datos en un valor de longitud fija. Se usa para almacenar contraseñas de forma segura. Ej: bcrypt, Argon2id.

**Hydra** — Herramienta de brute force para múltiples protocolos de red. Disponible en Kali Linux.

---

## I

**IDOR (Insecure Direct Object Reference)** — Vulnerabilidad que permite acceder a recursos de otros usuarios cambiando un ID en la URL.

**Injection** — Categoría de ataques donde código malicioso se inyecta en un sistema. Incluye SQLi, Command Injection, LDAP Injection.

---

## K

**Kali Linux** — Distribución Linux especializada en seguridad informática y pentesting. Incluye Hydra, Burp Suite, SQLMap y 600+ herramientas más.

---

## L

**LAMP** — Linux, Apache, MySQL, PHP. Equivalente de XAMPP en Linux.

**LFI (Local File Inclusion)** — Vulnerabilidad que permite incluir archivos del servidor en la respuesta web.

**Log** — Registro de eventos en un sistema. ULS CyberLab guarda logs de intentos de ataque en la tabla `security_logs`.

---

## M

**Magic Bytes** — Los primeros bytes de un archivo que identifican su tipo real (independiente de la extensión). JPEGs empiezan con `FF D8 FF`.

**MariaDB** — Fork de MySQL incluido en versiones recientes de XAMPP.

**MFA (Multi-Factor Authentication)** — Autenticación con dos o más factores: algo que sabes (contraseña), algo que tienes (teléfono), algo que eres (biometría).

**MIME Type** — Media type. Identificador del formato de un archivo. Ej: `image/jpeg`, `application/pdf`, `text/php`.

**mysqli** — Extensión PHP para interactuar con MySQL. Soporta prepared statements para prevenir SQLi.

---

## O

**OWASP** — Open Web Application Security Project. Fundación que publica el Top 10 de vulnerabilidades web más críticas.

---

## P

**Payload** — En el contexto de ataques, el código o datos maliciosos que el atacante intenta ejecutar.

**PDO (PHP Data Objects)** — Abstracción de base de datos en PHP. Alternativa a mysqli que también soporta prepared statements.

**Pentest (Penetration Testing)** — Prueba de penetración. Evaluación autorizada de la seguridad de un sistema mediante técnicas de ataque.

**Phishing** — Ataque de ingeniería social que engaña a las víctimas para revelar credenciales, generalmente mediante emails o sitios web falsos.

**Prepared Statements** — Consultas SQL parametrizadas que separan el código de los datos, eliminando la vulnerabilidad de SQL Injection.

---

## R

**Rate Limiting** — Limitación del número de peticiones que un usuario/IP puede hacer en un período de tiempo. Mitiga los ataques de brute force.

**RCE (Remote Code Execution)** — Ejecución Remota de Código. Permite ejecutar comandos arbitrarios en el servidor. El escenario más grave en seguridad web.

**Reflected XSS** — Tipo de XSS donde el payload se refleja inmediatamente en la respuesta del servidor, sin persistir.

**Responsible Disclosure** — Práctica de reportar vulnerabilidades al propietario antes de hacerlas públicas.

**rockyou.txt** — Lista de 14.3 millones de contraseñas reales filtradas de la brecha de RockYou.com en 2009. La wordlist más usada en pentesting.

---

## S

**Sanitization** — Proceso de limpiar datos de entrada para remover o neutralizar caracteres potencialmente peligrosos.

**Session Hijacking** — Robo de un ID de sesión para hacerse pasar por otro usuario.

**Shell** — Interfaz de línea de comandos. Un "webshell" es un script que provee acceso shell vía web.

**SIEM** — Security Information and Event Management. Sistema que centraliza y analiza logs de seguridad de múltiples fuentes.

**SQLi (SQL Injection)** — Vulnerabilidad que permite manipular queries SQL a través de la entrada del usuario.

**SQLMap** — Herramienta automática de detección y explotación de SQL Injection.

**Stored XSS** — Tipo de XSS donde el payload se almacena en el servidor y se ejecuta cada vez que alguien visita la página.

---

## T

**Threat Model (Modelo de Amenazas)** — Proceso estructurado para identificar posibles amenazas a un sistema y sus mitigaciones.

---

## V

**Validation** — Verificación de que los datos de entrada cumplen con el formato y tipo esperado.

**Vulnerability (Vulnerabilidad)** — Debilidad en un sistema que puede ser explotada por un atacante.

---

## W

**WAF (Web Application Firewall)** — Firewall especializado en filtrar tráfico HTTP/HTTPS malicioso.

**Webshell** — Script (generalmente PHP) que proporciona acceso de comandos al servidor a través del navegador web.

**Whitelist** — Lista de elementos permitidos. En seguridad, preferible a blacklist (lista de elementos bloqueados).

**Wordlist** — Lista de palabras/contraseñas usada en ataques de diccionario.

---

## X

**XAMPP** — Paquete de software que incluye Apache, MySQL, PHP y phpMyAdmin para desarrollo local.

**XSS (Cross-Site Scripting)** — Vulnerabilidad que permite inyectar scripts maliciosos en páginas web vistas por otros usuarios.

---

## Z

**Zero-Day** — Vulnerabilidad que aún no tiene parche disponible y es desconocida para el fabricante del software.
