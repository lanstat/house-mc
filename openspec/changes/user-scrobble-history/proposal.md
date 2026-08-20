## Why

Users want a personal music profile based on their listening history. Currently, the system has tracks, artists, albums, and playlists, but lacks any tracking of user play events (scrobbles) or aggregated metrics. Adding a per-user scrobble history enables listening profiles, top tracks, top artists, and historical listening stats.

## What Changes

- Introduce a raw scrobble event log (`user_scrobbles`) recording user play events with timestamps.
- Introduce an aggregated user track statistics table (`user_track_stats`) for performance on profile analytics.
- Implement an event-driven scrobble processing flow using NestJS Event Emitter to update stats asynchronously.
- Provide APIs to record a scrobble and retrieve user music profile data (top tracks, top artists, recent history).

## Capabilities

### New Capabilities
- `scrobble-history`: Per-user track scrobble logging, event-driven statistics aggregation, and music profile analytics endpoints.

### Modified Capabilities
- 

## Impact

- Database schema additions: new tables for scrobbles and track stats.
- New NestJS feature module for user scrobbles and profiling.
- Integration with existing users and tracks modules.
