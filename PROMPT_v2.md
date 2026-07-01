# OBJETIVO

Desarrollar de forma modular (Vertical Slicing) la funcionalidad de "Gestion de tracks" (Feature: `tracks`).

# FUNCIONALIDAD A DESARROLLAR

- Permitir la subida de archivos de musica
- Analisis de la metadata de archivo de musica
- CRUD de track de musica registrados
- Creacion automatica de album de musica al subir una cancion en base a la metadata
- Creacion automatica de artista en al subir una cancion
- Listar canciones por nombre, album, artista
- CRUD de album
- CRUD de artistas
- CRUD de playlist
- Adicion, quitado de canciones de playlist

# ANCLAJES FÍSICOS Y CONTEXTO DEL PROYECTO

- Utiliza las reglas arquitectónicas de nuestra base de código en GEMINI.md.
- Sigue de manera estricta el mapa de firmas definido en EXTENSIBILITY.md.
- Organiza los nuevos endpoints y clases exclusivamente en la carpeta modular: `/src/features/todo/`.

# REGLAS ARQUITECTÓNICAS Y DE NEGOCIO (MANIFIESTO ESTÁTICO)

1. Estructura del Track: Si la metadata de la cancion contiene informacion de album debe registrarse el album, en caso de existir debe vincularse, si la metadata tiene informacion del artista se debe crear en caso de ya existir se debe vincular.
2. Enrutamiento esperado:

- /api/albums/ Gestion de albums
- /api/albums/{id}/ Gestion de un album
- /api/artists/ Gestion de artistas
- /api/artists/{id}/ Gestion de un artista
- /api/tracks/ Gestion de tracks
- /api/tracks/{id}/ Gestion de un track

1. Enrutamiento Seguro: Los endpoints que requieran interactuar con informacion generada en especifico para el usuario autenticado deben seguir el patrón de diseño `/api/me/playlists` para evitar vulnerabilidades de manipulación de parámetros (IDOR).

# INSTRUCCIONES NEGATIVAS (MÁXIMA PRIORIDAD)

- BAJO NINGUNA CIRCUNSTANCIA uses el sufijo `Async` en los nombres de las funciones de servicio, a pesar de que toda la
  capa genere código asíncronas de manera explícita (usa Naming Semántico enfocado en negocio).
