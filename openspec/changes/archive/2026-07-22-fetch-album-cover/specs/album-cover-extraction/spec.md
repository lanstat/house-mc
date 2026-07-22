## ADDED Requirements

### Requirement: Album Cover Extraction and Persistence
When an audio track is uploaded, the system SHALL extract any embedded album cover/picture metadata from the audio file using the metadata parser. If an album is associated with the uploaded track, the extracted image buffer SHALL be written to disk under the uploads directory. The Album record in the database SHALL be updated with the relative path to this saved cover file in a `coverPath` property.

#### Scenario: Audio file with embedded cover and associated album
- **WHEN** a user uploads a valid audio file containing embedded cover art metadata, and an album is identified/created for the track
- **THEN** the system extracts the image buffer, saves it to disk, and persists the path in the album's `coverPath` field

#### Scenario: Audio file without embedded cover
- **WHEN** a user uploads an audio file without any embedded cover art metadata
- **THEN** the track is processed successfully and the album's `coverPath` remains unmodified (null)

### Requirement: Static Serving of Album Cover
The server SHALL serve files stored in the static upload directory under an HTTP route, allowing clients to download or view the extracted album cover images directly.

#### Scenario: Serve saved album cover over HTTP
- **WHEN** a client requests an extracted cover image URL that matches a saved cover file on disk
- **THEN** the server returns the image file with the correct MIME type and 200 OK status

### Requirement: Expose Album Cover in API Responses
The album list and detail API responses SHALL include the `coverPath` property.

#### Scenario: Retrieve album details
- **WHEN** a client performs a GET request to retrieve a single album or list of albums
- **THEN** the response payload includes the `coverPath` property for each album
