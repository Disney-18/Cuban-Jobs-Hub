# 🇨🇺 cu_JobsHub

**Conectando TODO el talento cubano con oportunidades globales**

[![GitHub stars](https://img.shields.io/github/stars/tuusuario/cu_jobshub?style=social)](https://github.com/tuusuario/cu_jobshub)
[![GitHub forks](https://img.shields.io/github/forks/tuusuario/cu_jobshub?style=social)](https://github.com/tuusuario/cu_jobshub)
[![GitHub issues](https://img.shields.io/github/issues/tuusuario/cu_jobshub)](https://github.com/tuusuario/cu_jobshub)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 ¿Qué es cu_JobsHub?

**cu_JobsHub** es un directorio multidisciplinario de **empleos remotos, becas, cursos, freelance y recursos** para profesionales cubanos en **TODAS las áreas profesionales**.

### 📊 Categorías incluidas:

| Categoría | Ejemplos |
|-----------|----------|
| 📋 Administración | Asistente virtual, gestión, office manager |
| 🎨 Diseño | Gráfico, UX/UI, branding, ilustración |
| ✍️ Redacción | Content writer, copywriter, periodismo |
| 📊 Marketing | Digital, redes sociales, SEO, SEM |
| 🌐 Traducción | Inglés-Español, interpretación |
| 🎥 Audiovisual | Edición de video, fotografía, producción |
| 🗣️ Idiomas | Clases de inglés, enseñanza de idiomas |
| 💻 Programación | Desarrollo web, mobile, data science |
| 📚 Educación | Tutoría, formación, enseñanza |
| 🏥 Salud | Telemedicina, asesoría nutricional |
| 🎭 Arte | Música, ilustración, comisiones |
| 💰 Finanzas | Contabilidad, bookkeeping, finanzas |
| 📈 Ventas | Telemarketing, ventas remotas |
| ⚖️ Legal | Asesoría legal, compliance |

**¡Y muchas más!**

---

## ✨ Características principales

| Característica | Descripción |
|----------------|-------------|
| ✅ **100% estático** | Sin necesidad de base de datos, servidor o dependencias |
| ✅ **Filtros inteligentes** | Por tipo, categoría, residencia y pago internacional |
| ✅ **Actualizado por la comunidad** | Cualquiera puede contribuir vía GitHub |
| ✅ **Sin sorpresas** | Cada oportunidad indica claramente requisitos |
| ✅ **Optimizado para Cuba** | Considerando las particularidades de acceso desde la isla |
| ✅ **Multidisciplinario** | Incluye TODAS las profesiones, no solo programación |

---

## 📂 Estructura del proyecto

```

cu_JobsHub/
├── index.html              # Página principal
├── README.md               # Este archivo
├── LICENSE                 # Licencia MIT
├── .gitignore              # Archivos ignorados
│
├── css/
│   └── styles.css          # Estilos completos
│
├── js/
│   └── app.js              # Lógica JavaScript
│
├── data/
│   └── oportunidades.json  # Los datos (esto es lo que editas)
│
├── scripts/
│   └── validate.js         # Script de validación
│
└── .github/
└── workflows/
├── validate.yml    # Validación automática
└── notify-telegram.yml  # Notificaciones a Telegram

```

---

## 🚀 Cómo añadir una oportunidad

### Paso 1: Haz un fork del repositorio

```

1. Ve a https://github.com/tuusuario/cu_JobsHub
2. Haz clic en "Fork" (arriba a la derecha)
3. Espera a que se cree tu copia

```

### Paso 2: Edita el archivo de datos

Edita `data/oportunidades.json` y añade una nueva entrada:

```json
{
  "id": "emp-006",
  "tipo": "empleo",
  "titulo": "Tu Oportunidad Aquí",
  "organizacion": "Nombre de la Empresa",
  "pais_organizacion": "País",
  "modalidad": "remoto",
  "pago_internacional": true,
  "metodos_pago": ["PayPal", "Wise", "Cripto"],
  "sin_residencia": true,
  "nivel": "intermedio",
  "fecha_limite": "2026-12-31",
  "enlace": "https://ejemplo.com/oferta",
  "descripcion": "Descripción detallada de la oportunidad...",
  "fuente": "LinkedIn",
  "categoria": "Administracion",
  "habilidades": ["Habilidad1", "Habilidad2"]
}
```

Paso 3: Abre un Pull Request

```
1. Ve a tu repositorio
2. Haz clic en "Pull Request"
3. Escribe un mensaje describiendo tu contribución
4. Haz clic en "Create Pull Request"
5. ¡Listo! Tu oportunidad será revisada
```

---

🛠 Tecnologías utilizadas

· HTML5 - Estructura semántica y accesible
· CSS puro - Sistema de diseño propio sin frameworks
· JavaScript Vanilla - Sin librerías ni dependencias
· JSON - Almacenamiento de datos
· Tabler Icons - Iconografía profesional
· GitHub Actions - CI/CD para validación y notificaciones

---

🌐 Despliegue

El proyecto está diseñado para ser desplegado en cualquier hosting estático:

Plataforma Configuración
GitHub Pages Activar en Settings → Pages → rama main
Netlify Conectar repositorio, sin comando de build
Vercel Conectar repositorio, sin comando de build
Cloudflare Pages Conectar repositorio, sin comando de build
Local python3 -m http.server 8080

Activar GitHub Pages (recomendado):

```
1. Ve a Settings → Pages
2. Source: Deploy from a branch
3. Branch: main → / (root)
4. Haz clic en "Save"
5. Tu sitio estará en: https://tuusuario.github.io/cu_JobsHub/
```

---

🔔 Notificaciones a Telegram (opcional)

El proyecto incluye un workflow que notifica automáticamente a Telegram cuando se añaden nuevas oportunidades.

Configuración:

```
1. Crea un bot con @BotFather en Telegram
2. Guarda el TELEGRAM_BOT_TOKEN
3. Obtén el TELEGRAM_CHAT_ID de tu canal
4. En GitHub: Settings → Secrets and variables → Actions
5. Añade los secretos:
   - TELEGRAM_BOT_TOKEN
   - TELEGRAM_CHAT_ID
```

---

🤝 Comunidad

Plataforma Enlace
Telegram @cujobshub
GitHub github.com/tuusuario/cu_jobshub
Twitter/X @cujobshub

---

📊 Estado del proyecto

🚧 En desarrollo activo — ¡Contribuciones bienvenidas!

Roadmap:

☑ Versión inicial con filtros básicos
☑ Sistema de categorías multidisciplinario
☑ Validación automática de datos
☑ Notificaciones a Telegram
☐ Página de detalle por oportunidad
☐ Formulario de contribución directa
☐ Versión en inglés

---
