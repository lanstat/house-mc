## 1. Backend Search Implementation

- [ ] 1.1 Update `TrackProvider.findAll` to accept an optional `query` (`q`) parameter and build TypeORM `Brackets` for filtering across track title, artist name, and album name.
- [ ] 1.2 Update `TrackService.findAll` to forward the `q` filter parameter to `TrackProvider`.
- [ ] 1.3 Update `TrackController.findAll` to extract `@Query('q') query?: string` and pass it to `TrackService.findAll`.

## 2. Verification and Tests

- [ ] 2.1 Add unit or e2e tests covering search by track name, artist name, and album name via query parameter `q`.
- [ ] 2.2 Run test suite to verify all checks pass successfully.
