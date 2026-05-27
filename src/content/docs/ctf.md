---
title: Flags y Sistema CTF
description: Sistema de Capture The Flag de ULS CyberLab
sidebar:
  order: 25
---

# Sistema CTF — Capture The Flag

## ¿Qué es un CTF?

Un **CTF (Capture The Flag)** es una competencia de ciberseguridad donde los participantes resuelven retos de hacking para obtener "banderas" (strings de texto especiales) que demuestran que completaron un desafío. 

ULS CyberLab usa un sistema CTF gamificado para motivar el aprendizaje y crear un ambiente competitivo amigable.

---

## Las 7 Flags del Laboratorio

### Flags Principales

| # | Flag | Módulo | Puntos | Cómo obtenerla |
|---|------|--------|--------|----------------|
| 1 | `FLAG{SQL_1NJ3CT10N_M4ST3R}` | Login (index.php) | 10 pts | SQL Injection en el formulario de login |
| 2 | `FLAG{UN10N_S3L3CT_PR0}` | sqli.php | 20 pts | UNION SELECT para extraer datos |
| 3 | `FLAG{XSS_R3FL3CT3D}` | xss.php | 10 pts | Reflected XSS con `alert()` |
| 4 | `FLAG{XSS_ST0R3D_PWN3D}` | xss.php | 20 pts | Stored XSS en comentarios |
| 5 | `FLAG{W3BSH3LL_UPL04D3D}` | upload.php | 25 pts | Subir archivo PHP como webshell |
| 6 | `FLAG{BRUT3_F0RC3_K1NG}` | bruteforce.php | 15 pts | Brute force al usuario `ceo` |
| 7 | `FLAG{ULS_CYB3RL4B_W1NN3R}` | ??? | 50 pts | **¡El reto final!** |

**Total posible: 150 puntos**

---

## El Reto Final — 50 Puntos

`FLAG{ULS_CYB3RL4B_W1NN3R}` es la flag más valiosa. Está en la base de datos pero **no tiene un módulo dedicado**. Debes encontrarla usando todo lo aprendido en los labs anteriores.

**Pista 1:** La flag existe en la tabla `flags` de la base de datos.  
**Pista 2:** Necesitas acceso a la BD para obtenerla.  
**Pista 3:** ¿Qué técnica del Lab 1 o Lab 3 podría darte acceso a la BD o al sistema de archivos?  
**Pista 4:** El archivo `includes/db.php` contiene credenciales de acceso a MySQL...

:::note[Spoiler — Solo si te rindes]
**Ruta de solución:** 
1. Usa el webshell subido en el Lab 3
2. Ejecuta: `shell.php?cmd=type+C:\xampp\htdocs\mini-cyberlab\includes\db.php`
3. Obtén las credenciales del DB
4. Conéctate a MySQL y busca la flag
5. Captúrala manualmente en el formulario de cualquier módulo

O alternativamente, usa UNION SELECT para extraer flags directamente:
`' UNION SELECT 1,flag_code FROM flags WHERE module='ctf'--`
:::

---

## Cómo Funciona el Sistema de Flags

### Captura Automática

La mayoría de flags se capturan automáticamente cuando el ataque es detectado:

```php
// includes/auth.php
function capture_flag($flag_code) {
    global $conn, $_SESSION;
    
    // Verificar que la flag existe en la BD
    $stmt = $conn->prepare("SELECT id, points FROM flags WHERE flag_code = ?");
    $stmt->bind_param("s", $flag_code);
    $stmt->execute();
    $flag = $stmt->get_result()->fetch_assoc();
    
    if (!$flag) return ['success' => false, 'message' => 'Flag inválida'];
    
    // Verificar que el usuario no la tenga ya
    $stmt = $conn->prepare(
        "SELECT id FROM captured_flags WHERE user_id = ? AND flag_id = ?"
    );
    $stmt->bind_param("ii", $_SESSION['user_id'], $flag['id']);
    $stmt->execute();
    
    if ($stmt->get_result()->num_rows > 0) {
        return ['success' => false, 'message' => 'Ya capturaste esta flag'];
    }
    
    // Registrar la captura
    $stmt = $conn->prepare(
        "INSERT INTO captured_flags (user_id, flag_id) VALUES (?, ?)"
    );
    $stmt->bind_param("ii", $_SESSION['user_id'], $flag['id']);
    $stmt->execute();
    
    // Actualizar puntos del usuario
    $stmt = $conn->prepare("UPDATE users SET points = points + ? WHERE id = ?");
    $stmt->bind_param("ii", $flag['points'], $_SESSION['user_id']);
    $stmt->execute();
    
    log_event('OK', 'ctf', "Flag capturada: $flag_code (+{$flag['points']} pts)");
    
    return ['success' => true, 'points' => $flag['points']];
}
```

### Captura Manual

Cada módulo tiene un formulario de captura manual:

```html
<form method="POST">
  <input type="text" name="flag" placeholder="FLAG{...}">
  <button type="submit">Capturar Flag</button>
</form>
```

También puedes usar la API directamente:

```bash
# Con curl (necesitas una sesión PHP activa)
curl -X POST http://localhost/mini-cyberlab/api/capture_flag.php \
  -b "PHPSESSID=tu_session_id" \
  -d "flag=FLAG{SQL_1NJ3CT10N_M4ST3R}"

# Respuesta
{
  "success": true,
  "message": "¡Flag capturada! +10 puntos",
  "points": 10
}
```

---

## El Scoreboard

El dashboard muestra el **Top 10** de participantes ordenado por:
1. Puntos totales (descendente)
2. Número de flags (desempate)
3. Fecha de último logro (desempate)

```sql
-- Query del scoreboard
SELECT u.username, u.points, COUNT(cf.id) as flags
FROM users u
LEFT JOIN captured_flags cf ON u.id = cf.user_id
GROUP BY u.id
ORDER BY u.points DESC, flags DESC
LIMIT 10
```

---

## Schema de la Base de Datos CTF

```sql
-- Flags disponibles
CREATE TABLE flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module VARCHAR(50),
    flag_code VARCHAR(100) UNIQUE,
    description TEXT,
    points INT DEFAULT 10
);

-- Flags capturadas por usuario
CREATE TABLE captured_flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    flag_id INT,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_capture (user_id, flag_id)  -- No duplicados
);
```

---

## Tips para Ganar el CTF

1. **Empieza por el Lab 1** — tiene la mejor relación dificultad/puntos para principiantes
2. **Lee el código fuente** — abrir los archivos PHP directamente te da ventaja
3. **Monitorea el dashboard** — los logs revelan si tu ataque funciona
4. **El Flag 7 vale 50 pts** — es la diferencia entre ganar y perder
5. **Trabaja en equipo** — cada persona puede especializarse en un lab diferente

---

## Tabla de Progreso Personal

Usa esta tabla para llevar tu progreso:

| Flag | ¿Capturada? | Notas |
|------|-------------|-------|
| `FLAG{SQL_1NJ3CT10N_M4ST3R}` | ⬜ | |
| `FLAG{UN10N_S3L3CT_PR0}` | ⬜ | |
| `FLAG{XSS_R3FL3CT3D}` | ⬜ | |
| `FLAG{XSS_ST0R3D_PWN3D}` | ⬜ | |
| `FLAG{W3BSH3LL_UPL04D3D}` | ⬜ | |
| `FLAG{BRUT3_F0RC3_K1NG}` | ⬜ | |
| `FLAG{ULS_CYB3RL4B_W1NN3R}` | ⬜ | |
| **Total** | **0/7 · 0 pts** | |
