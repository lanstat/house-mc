## Purpose

Allows users to log play events (scrobbles) for tracks and retrieve personalized music profile analytics such as listening history, top tracks, and top artists.

## ADDED Requirements

### Requirement: User can scrobble a track
The system SHALL allow authenticated users to record a play event for any existing track.

#### Scenario: Successful scrobble recording
- **WHEN** an authenticated user sends a scrobble request with a valid track ID
- **THEN** the system records the play event with a timestamp and increments the user's track statistics

### Requirement: User can view personal music profile and top stats
The system SHALL allow users to retrieve their listening statistics, including recent scrobble history, top tracks, and top artists.

#### Scenario: Retrieving user profile metrics
- **WHEN** a user requests their music profile or top tracks/artists
- **THEN** the system returns aggregated statistics ordered by play frequency and chronological recent scrobbles
