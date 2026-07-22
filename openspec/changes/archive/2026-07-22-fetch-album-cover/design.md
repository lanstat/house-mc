## Context

Currently, the application allows track uploads, parsing their basic metadata (title, artist, album, duration) using `music-metadata`. However, any embedded album art (cover images) in the files is ignored. We need to extract these cover images during track uploads, save them to the server's local file system, and link them to the corresponding `Album` entities so that clients can fetch and display them.

## Goals / Non-Goals

**Goals:**
- Add `coverPath` column to `AlbumEntity` and `Album` model.
- Automatically extract the first embedded cover art from the audio metadata buffer.
- Save the cover art to `uploads/covers/album-<id>.<ext>` when a track is uploaded.
- Persist the cover file path in the `Album` entity.
- Serve the `uploads/` directory as static files in NestJS.
- Expose the `coverPath` field in the album endpoints (`GET /api/albums` and `GET /api/albums/:id`).

**Non-Goals:**
- Providing user interfaces/web interface for manual cover art uploads.
- Fetching cover art from external APIs (e.g., Spotify, MusicBrainz).
- Supporting multiple cover images per album (only the first embedded cover will be extracted).

## Decisions

### 1. Database Model Schema Update
We will add `coverPath` as a nullable column of type `varchar` to the `AlbumEntity`.
- **Why**: An album cover is directly associated with the Album entity. Adding it to the `track_albums` table allows easy query retrieval and mapping.
- **Alternatives considered**: Storing the cover art on the Track level. However, this duplicates the data across multiple tracks of the same album. Storing it on the Album level is clean and structurally correct.

### 2. Static File Serving
We will configure NestJS to serve the `uploads/` directory as static assets.
- **Why**: Express-based NestJS provides built-in support for serving static assets via `NestExpressApplication`'s `app.useStaticAssets()`. This is highly performant and requires no extra npm dependencies.
- **Alternatives considered**: Implementing a dedicated controller endpoint to stream files. This is unnecessary and less efficient than letting Express static middleware serve the directory directly.

### 3. File Naming and Duplication Prevention
When a cover image is extracted, we will save it to `uploads/covers/album-<albumId>.<ext>`.
- **Why**: Using the `albumId` in the filename ensures that if multiple tracks of the same album are uploaded, they overwrite/reuse the same cover art file rather than creating infinitely many duplicate images.
- **Alternatives considered**: Naming the file with a random UUID. This would result in duplicate images if multiple tracks from the same album are uploaded, filling up the disk unnecessarily.

## Risks / Trade-offs

- **[Risk] High memory usage with large buffers** → The image extraction processes buffers in-memory during upload. For very large cover arts, this might spike memory.
  - *Mitigation*: We rely on Node's garbage collection to clean up buffers after saving them to disk.
- **[Risk] Multiple tracks with different cover arts** → If different tracks of the same album are uploaded with different cover art embedded, the last one uploaded will overwrite the previous cover.
  - *Mitigation*: This is expected and standard, as typically all tracks of a single album share the same cover art.
