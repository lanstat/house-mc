## Purpose

Provides a unified track finder and search capability across track titles, artist names, and album names to allow users to easily discover music in their library.

## ADDED Requirements

### Requirement: Unified Track Search Query
The system SHALL provide a search query parameter that matches tracks where the query string is a substring of the track title, the artist name, or the album name.

#### Scenario: Searching by track title
- **WHEN** a client queries tracks with search term matching a track title
- **THEN** the system returns all matching tracks containing that title substring

#### Scenario: Searching by artist name
- **WHEN** a client queries tracks with search term matching an artist name
- **THEN** the system returns all tracks associated with artists matching that substring

#### Scenario: Searching by album name
- **WHEN** a client queries tracks with search term matching an album name
- **THEN** the system returns all tracks associated with albums matching that substring
