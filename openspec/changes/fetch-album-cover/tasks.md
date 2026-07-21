## 1. Database and Model Updates

- [ ] 1.1 Add `coverPath` column of type `varchar` (nullable) to the `AlbumEntity` class in `src/features/tracks/entities/album.entity.ts`.
- [ ] 1.2 Add `coverPath: string | null` property to the `Album` model class in `src/features/tracks/models/album.model.ts`.

## 2. Service and Logic Implementation

- [ ] 2.1 Extract embedded album cover/picture metadata from the file buffer in `TrackService.uploadTrack()` using `music-metadata`.
- [ ] 2.2 If a picture exists and the track belongs to an album, write the cover image to disk under `uploads/covers/album-<albumId>.<ext>` and update the album's `coverPath` in the database.

## 3. Static File Serving

- [ ] 3.1 Configure NestExpressApplication static asset serving in `src/main.ts` to serve the `uploads/` directory under `/uploads/`.

## 4. Verification and Testing

- [ ] 4.1 Run existing tests to ensure no regressions are introduced.
- [ ] 4.2 Create a test case (or modify an e2e test) to verify successful extraction, persistence, and static serving of album covers on upload.
