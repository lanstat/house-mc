## Why

When users upload audio tracks, any embedded album art in the audio file metadata (ID3 tags/Vorbis comments/etc.) is currently ignored. Extracting and persisting these album covers on upload improves the visual experience and completeness of the music collection.

## What Changes

- Parse embedded album cover/picture metadata from the audio file using `music-metadata`.
- If a picture is found and an album exists or is created for the track, extract and save the image file to the static assets directory.
- Update the `Album` entity and model to store a `coverPath` referencing the extracted cover image.
- Serve the extracted album covers as static assets.
- Expose the `coverPath` via the album API endpoints.

## Capabilities

### New Capabilities
- `album-cover-extraction`: Automatically extracts, saves, and serves album cover images embedded within uploaded audio files.

### Modified Capabilities

## Impact

- **Database**: Add `coverPath` field to `AlbumEntity` (SQLite `track_albums` table).
- **Entities/Models**: Update `AlbumEntity` and `Album` model with `coverPath`.
- **Services**: `TrackService` handles extraction, `AlbumService` and `AlbumProvider` handle persisting and updating the `coverPath` field.
- **Static Assets**: Configure NestJS to serve the `uploads/` (or `uploads/covers`) directory so that covers can be retrieved over HTTP.
