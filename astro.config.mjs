import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'ULS CyberLab',
      description: 'Documentación oficial del Mini Laboratorio de Hacking Ético - FESOL 2026',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.ico',
      defaultLocale: 'es',
      locales: {
        root: {
          label: 'Español',
          lang: 'es',
        },
      },
      social: {
        github: 'https://github.com/universidad-luterana-salvadorena',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: '🏠 Inicio',
          link: '/',
        },
        {
          label: '📋 El Proyecto',
          items: [
            { label: 'Introducción', link: '/introduccion/' },
            { label: 'Objetivos', link: '/objetivos/' },
            { label: 'Características', link: '/caracteristicas/' },
            { label: 'Arquitectura', link: '/arquitectura/' },
          ],
        },
        {
          label: '⚙️ Setup & Configuración',
          items: [
            { label: 'Requerimientos', link: '/requerimientos/' },
            { label: 'Instalación', link: '/instalacion/' },
            { label: 'Base de Datos', link: '/base-datos/' },
          ],
        },
        {
          label: '🛠️ Stack Tecnológico',
          items: [
            { label: 'Tecnologías', link: '/tecnologias/' },
            { label: 'Herramientas', link: '/herramientas/' },
            { label: 'Usos y Aplicaciones', link: '/usos/' },
          ],
        },
        {
          label: '📚 Marco Teórico',
          items: [
            { label: 'Fundamentos', link: '/marco-teorico/' },
            { label: 'SQL Injection', link: '/marco-teorico/sql-injection/' },
            { label: 'Cross-Site Scripting', link: '/marco-teorico/xss/' },
            { label: 'File Upload Attacks', link: '/marco-teorico/file-upload/' },
            { label: 'Brute Force', link: '/marco-teorico/bruteforce/' },
            { label: 'OWASP Top 10', link: '/marco-teorico/owasp/' },
          ],
        },
        {
          label: '🔬 Laboratorios',
          items: [
            { label: 'Guía de Laboratorios', link: '/laboratorios/' },
            { label: 'Lab 1: SQL Injection', link: '/laboratorios/sqli/' },
            { label: 'Lab 2: XSS', link: '/laboratorios/xss/' },
            { label: 'Lab 3: File Upload', link: '/laboratorios/upload/' },
            { label: 'Lab 4: Brute Force', link: '/laboratorios/bruteforce/' },
          ],
        },
        {
          label: '🚩 Sistema CTF',
          items: [
            { label: 'Flags & Puntuación', link: '/ctf/' },
          ],
        },
        {
          label: '💡 Buenas Prácticas',
          items: [
            { label: 'Consejos de Seguridad', link: '/consejos/' },
            { label: 'Mitigación de Vulnerabilidades', link: '/mitigacion/' },
            { label: 'Ética en Seguridad', link: '/etica/' },
          ],
        },
        {
          label: '📝 Conclusiones',
          link: '/conclusiones/',
        },
        {
          label: '📖 Glosario',
          link: '/glosario/',
        },
        {
          label: '🔗 Referencias',
          link: '/referencias/',
        },
      ],
    }),
  ],
});
