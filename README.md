# ULS CyberLab — Documentación Oficial

Documentación completa del **Mini Laboratorio de Hacking Ético** de la Universidad Luterana Salvadoreña, desarrollada con [Astro Starlight](https://starlight.astro.build/).

## Estructura

```
docs/
├── src/
│   ├── content/docs/          # Páginas de documentación (Markdown/MDX)
│   │   ├── index.mdx          # Página principal
│   │   ├── introduccion.md
│   │   ├── objetivos.md
│   │   ├── caracteristicas.md
│   │   ├── arquitectura.md
│   │   ├── requerimientos.md
│   │   ├── instalacion.md
│   │   ├── tecnologias.md
│   │   ├── herramientas.md
│   │   ├── usos.md
│   │   ├── base-datos.md
│   │   ├── ctf.md
│   │   ├── marco-teorico/
│   │   │   ├── index.md       # Fundamentos
│   │   │   ├── sql-injection.md
│   │   │   ├── xss.md
│   │   │   ├── file-upload.md
│   │   │   ├── bruteforce.md
│   │   │   └── owasp.md
│   │   ├── laboratorios/
│   │   │   ├── index.md       # Guía general
│   │   │   ├── sqli.md
│   │   │   ├── xss.md
│   │   │   ├── upload.md
│   │   │   └── bruteforce.md
│   │   ├── consejos.md
│   │   ├── mitigacion.md
│   │   ├── etica.md
│   │   ├── conclusiones.md
│   │   ├── glosario.md
│   │   └── referencias.md
│   ├── assets/                # Imágenes y SVGs
│   └── styles/custom.css      # Tema dark hacker personalizado
├── public/                    # Archivos estáticos
├── astro.config.mjs           # Configuración de Astro + Starlight
└── package.json
```

## Comandos

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (con hot reload)
npm run dev
# → http://localhost:4321/

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Páginas Incluidas (30 páginas)

| Sección | Páginas |
|---------|---------|
| El Proyecto | Introducción, Objetivos, Características, Arquitectura |
| Setup | Requerimientos, Instalación, Base de Datos |
| Stack | Tecnologías, Herramientas, Usos |
| Marco Teórico | Fundamentos, SQLi, XSS, File Upload, Brute Force, OWASP |
| Laboratorios | Guía, Lab SQLi, Lab XSS, Lab Upload, Lab Brute Force |
| CTF | Flags y Sistema de Puntuación |
| Buenas Prácticas | Consejos, Mitigación, Ética |
| Cierre | Conclusiones, Glosario, Referencias |

---

*FESOL 2026 · Universidad Luterana Salvadoreña · Seguridad Informática*
