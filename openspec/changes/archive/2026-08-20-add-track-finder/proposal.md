## Why

Users need a way to quickly find and discover tracks in their music library by searching across track titles, artist names, and album names. Currently, search filters are fragmented or require separate specific parameters.

## What Changes

- Add a unified track search / finder capability.
- Support searching across multiple fields (track title, artist name, album name) through a single query parameter (e.g. `q`).
- Provide an API endpoint or query enhancement on tracks for seamless search lookup.

## Capabilities

### New Capabilities
- `track-finder`: Unified search and discovery across tracks, artists, and albums.

### Modified Capabilities
- 

## Impact

- `TrackProvider` and `TrackService` in `src/features/tracks/`
- API query handling in `TrackController`
