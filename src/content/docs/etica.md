---
title: Ética en Seguridad Informática
description: Marco ético y legal para el uso de técnicas de hacking en ULS CyberLab
sidebar:
  order: 32
---

# Ética en Seguridad Informática

## ¿Qué es el Hacking Ético?

El **hacking ético** (también conocido como *penetration testing* o *pentesting*) es la práctica de aplicar técnicas de hacking con **autorización explícita** del propietario del sistema, con el objetivo de identificar y corregir vulnerabilidades antes de que un atacante malicioso las explote.

```
Hacking Ético ≠ Hacking Malicioso

La diferencia no está en las TÉCNICAS (son las mismas)
La diferencia está en la AUTORIZACIÓN y la INTENCIÓN
```

---

## Los Tres Pilares del Hacking Ético

### 1. Autorización
```
Tienes permiso → Ético ✅
No tienes permiso → Delito ❌
```
Siempre debes obtener autorización **por escrito** antes de realizar cualquier prueba de seguridad. Un correo electrónico o contrato que especifique el alcance del trabajo.

### 2. Alcance (Scope)
La autorización define **qué** puedes probar:
- ✅ "Puedes probar el servidor web en 192.168.1.100"
- ✅ "Puedes probar la aplicación en staging.empresa.com"
- ❌ "No puedes acceder a sistemas de terceros"
- ❌ "No puedes interrumpir el servicio en producción"

### 3. Responsible Disclosure (Divulgación Responsable)
Cuando encuentras una vulnerabilidad:

```
1. Documenta el hallazgo detalladamente
2. Notifica PRIVADAMENTE al propietario
3. Da tiempo razonable para corregir (90 días es estándar)
4. Solo publicar después de que esté corregido
5. NUNCA vender la vulnerabilidad a terceros maliciosos
```

---

## El Marco Legal en El Salvador

### Ley Especial Contra los Delitos Informáticos y Conexos

Artículos relevantes:

| Artículo | Delito | Pena |
|----------|--------|------|
| Art. 4 | Acceso indebido a sistemas informáticos | 1-4 años de prisión |
| Art. 5 | Perturbación de servicio informático | 2-5 años |
| Art. 6 | Daños informáticos | 2-8 años |
| Art. 7 | Sabotaje informático | 4-10 años |
| Art. 11 | Fraude informático | 3-8 años |
| Art. 14 | Interceptación ilegal de datos | 2-6 años |

**Importante:** Estas leyes aplican **incluso** si el atacante no causa daño visible. El simple acceso no autorizado es suficiente para ser procesado penalmente.

### ULS CyberLab y la Ley

ULS CyberLab está **diseñado específicamente** para que los estudiantes tengan autorización implícita de practicar en él:
- El proyecto es tuyo (instalado en tu propio XAMPP)
- O es del laboratorio (con autorización de la institución)
- Las técnicas practicadas son legales **solo en este entorno**

---

## Certificaciones de Hacking Ético

Si deseas formalizar tu carrera en ciberseguridad, estas certificaciones tienen reconocimiento internacional:

| Certificación | Organización | Nivel | Costo aproximado |
|--------------|--------------|-------|-----------------|
| **CEH** (Certified Ethical Hacker) | EC-Council | Intermedio | $500-1000 USD |
| **OSCP** (Offensive Security Certified Professional) | Offensive Security | Avanzado | $1499 USD |
| **eJPT** | INE/eLearnSecurity | Principiante | $200 USD |
| **CompTIA Security+** | CompTIA | Principiante | $370 USD |
| **CompTIA PenTest+** | CompTIA | Intermedio | $370 USD |
| **PNPT** | TCM Security | Intermedio | $399 USD |

**Para estudiantes de la ULS:** El **eJPT** es una excelente primera certificación y es asequible. ULS CyberLab es un buen punto de partida para prepararse.

---

## Plataformas de Práctica Legal

Una vez que domines ULS CyberLab, puedes continuar en estas plataformas 100% legales:

| Plataforma | Descripción | Costo |
|------------|-------------|-------|
| [TryHackMe](https://tryhackme.com) | Guiado, ideal para principiantes | Freemium |
| [HackTheBox](https://hackthebox.com) | Más desafiante, menos guiado | Freemium |
| [PortSwigger Academy](https://portswigger.net/web-security) | Solo web, excelente calidad | Gratuito |
| [VulnHub](https://www.vulnhub.com) | VMs vulnerables para descargar | Gratuito |
| [PicoCTF](https://picoctf.org) | CTF para principiantes | Gratuito |
| [DVWA](https://dvwa.co.uk) | Similar a ULS CyberLab | Gratuito |
| [OverTheWire](https://overthewire.org) | Wargames Linux/Web | Gratuito |

---

## El Código de Ética del Hacker Ético

```
1. SIEMPRE obtengo autorización antes de probar sistemas.
2. SOLO accedo a los sistemas y datos que están dentro del scope acordado.
3. REPORTO todos los hallazgos al cliente de forma responsable.
4. NO comparto información confidencial del cliente con terceros.
5. NO instalo backdoors ni acceso persistente sin autorización explícita.
6. NO daño ni interrumpo los sistemas del cliente.
7. DOCUMENTO todo mi trabajo para facilitar la mitigación.
8. CONTINÚO aprendiendo y actualizando mis conocimientos.
9. RECHAZO trabajos que no cumplan estándares éticos.
10. PROMUEVO la cultura de seguridad en la comunidad.
```

---

## Bug Bounty — Hack y Gana Dinero Legalmente

Los programas de **Bug Bounty** permiten reportar vulnerabilidades en sistemas reales de grandes empresas a cambio de recompensas económicas:

| Plataforma | Empresas participantes | Recompensas |
|------------|----------------------|-------------|
| [HackerOne](https://hackerone.com) | Google, Apple, Twitter... | $100 - $100,000+ |
| [Bugcrowd](https://bugcrowd.com) | Tesla, Mastercard... | $50 - $50,000+ |
| [Intigriti](https://intigriti.com) | Europeas principalmente | $50 - $20,000+ |

**Cómo empezar en Bug Bounty:**
1. Domina los fundamentos (ULS CyberLab, PortSwigger)
2. Entiende bien cada vulnerabilidad y sus variantes
3. Empieza por programas con bajo tráfico (más fácil encontrar bugs)
4. Lee reportes públicos de otras personas para aprender
5. Sé paciente — los primeros bugs toman tiempo

---

## Conclusión Ética

> La ciberseguridad es una de las pocas profesiones donde las mismas habilidades que te hacen valioso para defender a las organizaciones son las que podrían usarse para dañarlas. Esta dualidad conlleva una **responsabilidad especial**.

Usa el conocimiento adquirido en ULS CyberLab para:
- ✅ Proteger sistemas de tu familia, empresa y comunidad
- ✅ Contribuir a proyectos open source de seguridad
- ✅ Participar en CTFs y Bug Bounties
- ✅ Educar a otros sobre buenas prácticas
- ✅ Construir una carrera ética y respetada

**Nunca para:**
- ❌ Acceder a sistemas sin autorización
- ❌ Robar información personal o financiera
- ❌ Extorsionar a individuos u organizaciones
- ❌ Distribuir malware o herramientas de ataque malicioso
