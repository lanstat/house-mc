## Context

See proposal.md for motivation. The codebase is built with NestJS, TypeORM, and modular feature architecture (`src/features/` and `src/core/`).

## Goals / Non-Goals

**Goals:**
- Provide robust storage for raw scrobble events and aggregated user statistics.
- Keep scrobble ingestion fast using event-driven background processing.
- Expose endpoints to record scrobbles and retrieve music profiles/top stats.

**Non-Goals:**
- Real-time websocket broadcasting of what friends are listening to (out of scope).
- Complex recommendation engines (deferred to future changes).

## Decisions

- **Dual-Table Architecture**: 
  - `user_scrobbles` stores raw timestamped play events.
  - `user_track_stats` stores denormalized play counts per user and track.
  - *Rationale*: Raw table supports historical timelines, while aggregated stats table ensures instant top-track/top-artist queries without full table scans.
- **Event-Driven Processing via NestJS Event Emitter**:
  - `ScrobbleService` logs the raw scrobble and emits a `track.scrobbled` event.
  - Event listeners asynchronously update `user_track_stats`.
  - *Rationale*: Keeps API response times minimal and decouples analytics calculation from the core ingestion flow.

## Risks / Trade-offs

- [Eventual Consistency of Stats] → Background event listeners mean stats might lag slightly behind raw scrobbles. Mitigated by synchronous logging of raw events so no data is ever lost.
- [Database Growth on Raw Scrobbles] → Over time `user_scrobbles` can grow large. Partitioning or archiving can be introduced in a future scaling phase if needed.
