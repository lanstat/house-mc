## 1. Data Models and Entities

- [x] 1.1 Create `UserScrobbleEntity` in tracks feature or core module linking users and tracks with timestamps
- [x] 1.2 Create `UserTrackStatsEntity` for aggregated play counts and last played timestamps

## 2. Services and Event Handling

- [x] 2.1 Implement `ScrobbleService` to record scrobbles and emit `track.scrobbled` events
- [x] 2.2 Implement event listener to asynchronously upsert `UserTrackStatsEntity` on `track.scrobbled`
- [x] 2.3 Implement music profile query methods for top tracks, top artists, and recent scrobbles

## 3. Controllers and API Endpoints

- [x] 3.1 Create `ScrobbleController` with endpoint to record a scrobble (POST /tracks/:id/scrobble or similar)
- [x] 3.2 Create profile/stats endpoints to retrieve user listening statistics and history

## 4. Testing and Verification

- [x] 4.1 Write unit tests for scrobble service and event listeners
- [x] 4.2 Write e2e tests for scrobble logging and profile retrieval
