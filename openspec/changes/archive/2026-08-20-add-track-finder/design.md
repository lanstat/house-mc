## Context

See proposal.md for motivation. Currently, `TrackProvider` and `TrackController` support individual filters (`title`, `album`, `artist`). We want to introduce a unified search parameter (e.g., `q`) to query across these fields simultaneously using TypeORM query builder.

## Goals / Non-Goals

**Goals:**
- Add a query parameter `q` to `GET /api/tracks` that performs an `OR` condition match across track title, artist name, and album name.
- Keep backward compatibility with existing individual query parameters (`title`, `album`, `artist`).

**Non-Goals:**
- Full-text search engine integration (Elasticsearch/Meilisearch). TypeORM `LIKE` query builder filtering is sufficient for this scope.

## Decisions

- **Decision 1: Unified Query Parameter `q`**
  - *Choice*: Add an optional `q` string parameter to `TrackController` and `TrackProvider`.
  - *Rationale*: Clean and intuitive REST API design, easy to integrate in frontend and clients.
  - *Alternatives*: Creating a dedicated `/api/tracks/search` route (rejected to keep standard collection querying consistent).

- **Decision 2: Query Construction via TypeORM**
  - *Choice*: Use `Brackets` in TypeORM to construct an `OR` query condition across `track.title`, `artist.name`, and `album.name`.
  - *Rationale*: Ensures clean SQL generation and prevents query syntax errors while supporting partial substring matches (`LIKE`).

## Risks / Trade-offs

- [Performance with large datasets] `LIKE` searches on unindexed text columns can be slow at scale. → Mitigation: Acceptable for current library size; indexes can be added later if needed.
