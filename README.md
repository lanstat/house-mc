# house-mc 🚀

`house-mc` es una aplicación de servidor moderna, robusta y progresiva construida con **NestJS (v11+)** y **TypeScript**. Está diseñada como una API backend para gestionar usuarios, autenticación, y cuenta con características avanzadas de gestión de proyectos/tareas (Todo) y una biblioteca de pistas musicales (Tracks).

Este proyecto está estructurado siguiendo patrones de arquitectura limpia y acoplamiento débil (mediante eventos), lo que facilita su extensión por parte de desarrolladores de código abierto (open-source).

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
  - [Características Principales](#características-principales)
  - [Arquitectura y Buenas Prácticas](#arquitectura-y-buenas-prácticas)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [⚙️ Configuración y Uso](#️-configuración-y-uso)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Desarrollo](#desarrollo)
  - [Producción](#producción)
  - [Pruebas (Testing)](#pruebas-testing)
  - [Formateo y Linting](#formateo-y-linting)
- [🤝 Cómo Contribuir](#-cómo-contribuir)
- [🔗 Vínculos de Interés](#-vínculos-de-interés)
  - [Documentación Interna](#documentación-interna)
  - [Recursos Externos](#recursos-externos)

---

## 📖 Sobre el Proyecto

`house-mc` ofrece una base de código estructurada para desarrolladores que buscan un backend robusto basado en TypeScript. Es ideal como plantilla para nuevos desarrollos o como sistema funcional para la gestión personal.

### Características Principales

*   **Autenticación y Seguridad (Core):**
    *   Autenticación basada en **JWT (JSON Web Tokens)**.
    *   Rutas protegidas de forma global mediante un `AuthGuard`.
    *   Decorador personalizado [auth.decorator.ts](file:///home/lanstat/Projects/house-mc/src/core/auth/auth.decorator.ts) (que proporciona el decorador `@Public()`) para eximir rutas específicas de la autenticación de forma sencilla.
*   **Gestión de Usuarios (Core):**
    *   Creación, eliminación y administración de perfiles de usuario.
*   **Gestión de Tareas y Proyectos (Feature - Todo):**
    *   Creación de proyectos y tareas individuales.
    *   Reglas de visibilidad y pertenencia estricta basadas en el ID del usuario autenticado.
*   **Gestión de Biblioteca Musical (Feature - Tracks):**
    *   Organización de pistas de audio, álbumes, artistas y listas de reproducción (Playlists).
    *   Extracción y análisis de metadatos de archivos de audio mediante `music-metadata`.

### Arquitectura y Buenas Prácticas

El proyecto sigue una arquitectura modular y estructurada dentro de [src/features/](file:///home/lanstat/Projects/house-mc/src/features) y [src/core/](file:///home/lanstat/Projects/house-mc/src/core). Implementa:
1.  **Patrón Entidad-Proveedor-Modelo (Entity-Provider-Model):**
    *   *Entity:* Representa la tabla física de la base de datos (TypeORM).
    *   *Model:* Representa el objeto de dominio limpio con validaciones/transformaciones.
    *   *Provider:* Capa de abstracción de acceso a datos que interactúa con el repositorio y realiza el mapeo entre Entidades y Modelos.
2.  **Arquitectura Dirigida por Eventos:**
    *   Uso de `@nestjs/event-emitter` para desacoplar efectos secundarios (por ejemplo, automatizar acciones al registrar un usuario sin acoplar los servicios directamente).

---

## 🛠️ Tecnologías Utilizadas

Las tecnologías principales que impulsan este backend son:

*   **Framework Principal:** [NestJS (v11+)](https://nestjs.com/)
*   **Lenguaje:** [TypeScript (v5.7+)](https://www.typescriptlang.org/)
*   **Base de Datos:** [SQLite](https://www.sqlite.org/) gestionada mediante [TypeORM](https://typeorm.io/) y el driver `better-sqlite3`.
*   **Seguridad:** `@nestjs/jwt` para la gestión de tokens.
*   **Validación de Datos:** `class-validator` y `class-transformer` para validar DTOs (Data Transfer Objects).
*   **Eventos:** `@nestjs/event-emitter` para desacoplamiento lógico.
*   **Procesamiento de Audio:** `music-metadata` para parsear metadatos de pistas de audio.
*   **Pruebas:** [Jest](https://jestjs.io/) y `supertest`.

---

## ⚙️ Configuración y Uso

### Requisitos Previos

Asegúrate de tener instalados:
*   [Node.js](https://nodejs.org/) (versión LTS recomendada, v18 o superior)
*   [npm](https://www.npmjs.com/) o tu gestor de paquetes favorito

### Instalación

Clona el repositorio e instala las dependencias del proyecto:

```bash
npm install
```

### Desarrollo

Para iniciar el servidor de desarrollo local con recarga en tiempo real (watch mode):

```bash
npm run start:dev
```

Para arrancar el servidor en modo de depuración (debug mode):

```bash
npm run start:debug
```

### Producción

Para compilar y preparar el proyecto para entornos de producción:

```bash
# Compilar la aplicación
npm run build

# Iniciar la build de producción
npm run start:prod
```

### Pruebas (Testing)

El proyecto cuenta con suites de pruebas unitarias y de extremo a extremo (E2E):

```bash
# Ejecutar pruebas unitarias
npm run test

# Ejecutar pruebas unitarias en watch mode
npm run test:watch

# Ejecutar pruebas de integración/E2E
npm run test:e2e

# Verificar cobertura de pruebas
npm run test:cov
```

### Formateo y Linting

Para asegurar la calidad del código antes de enviar contribuciones:

```bash
# Ejecutar ESLint para identificar y corregir errores de estilo
npm run lint

# Formatear el código con Prettier
npm run format
```

---

## 🤝 Cómo Contribuir

¡Toda contribución es bienvenida! Si eres un desarrollador de código abierto y deseas colaborar:
1.  Familiarízate con nuestra [Guía de Extensibilidad (EXTENSIBILITY.md)](file:///home/lanstat/Projects/house-mc/EXTENSIBILITY.md) para comprender la estructura de capas y convenciones de nombres.
2.  Crea una rama para tu feature o corrección (`git checkout -b feature/nueva-caracteristica`).
3.  Implementa tu lógica en el directorio de características [src/features/](file:///home/lanstat/Projects/house-mc/src/features) si es una nueva funcionalidad de negocio.
4.  Asegúrate de implementar el **patrón Entidad-Proveedor-Modelo** para cualquier nueva entidad de base de datos.
5.  Protege tus rutas por defecto o usa `@Public()` conscientemente.
6.  Ejecuta `npm run lint` y `npm run format` antes de hacer commit.
7.  Abre un Pull Request explicando detalladamente los cambios realizados.

---

## 🔗 Vínculos de Interés

### Documentación Interna
*   [Guía de Extensibilidad (EXTENSIBILITY.md)](file:///home/lanstat/Projects/house-mc/EXTENSIBILITY.md) - Reglas del proyecto para agregar código, controladores, servicios y proveedores.
*   [Instrucciones del Proyecto (GEMINI.md)](file:///home/lanstat/Projects/house-mc/GEMINI.md) - Resumen arquitectónico y convenciones locales.

### Recursos Externos
*   [Sitio Oficial de NestJS](https://nestjs.com/)
*   [Documentación de NestJS](https://docs.nestjs.com/)
*   [Repositorio de GitHub de NestJS](https://github.com/nestjs/nest)
*   [Documentación de TypeORM](https://typeorm.io/)
*   [npm packages - better-sqlite3](https://www.npmjs.com/package/better-sqlite3)
