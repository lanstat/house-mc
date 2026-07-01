# house-mc

## Project Overview

`house-mc` is a progressive [NestJS](https://nestjs.com/) server-side application built with TypeScript. It provides a robust backend for managing users, authentication, and a feature-rich todo/project management system.

### Key Technologies

- **Framework:** NestJS (v11+)
- **Language:** TypeScript
- **Database:** Sqlite via TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **Events:** `@nestjs/event-emitter` for decoupled event-driven logic.
- **Validation:** `class-validator` and `class-transformer` for DTO validation.

### Architecture

The project follows a modular architecture:

- **`src/core/`**: Contains fundamental system modules.
  - **`auth/`**: Authentication logic, JWT strategy, and guards.
  - **`users/`**: User management, entities, and services.
- **`src/features/`**: Contains domain-specific features.
  - **`todo/`**: Task and project management, including ownership and visibility rules.

## Building and Running

### Setup

```bash
npm install
```

### Development

```bash
# Run in watch mode
npm run start:dev

# Run in debug mode
npm run start:debug
```

### Production

```bash
# Build the project
npm run build

# Run the production build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting & Formatting

```bash
# Lint the codebase
npm run lint

# Format with Prettier
npm run format
```

## Development Conventions

### Feature Structure

New features should be added to `src/features/`. Each feature module should ideally contain:

- `controllers/`: Request handlers.
- `services/`: Business logic.
- `entities/`: TypeORM database models.
- `models/`: Plain TypeScript interfaces or types.
- `providers/`: Data access abstraction layer.
- `listeners/`: Event handlers.

### Authentication & Security

- **Global Protection:** The `AuthGuard` is registered globally. All endpoints require a valid JWT by default.
- **Public Endpoints:** Use the `@Public()` decorator from `src/core/auth/auth.decorator.ts` to exempt specific controllers or routes from authentication.
- **Ownership:** Always verify resource ownership in services using the `userId` from the request object (populated by `AuthGuard`).

### Event-Driven Logic

- Use `EventEmitter2` to decouple side effects from primary business logic (e.g., creating a default task when a user is created).
- Listeners are located in `listeners/` directories within their respective modules.

### Data Access

- Prefer using **Providers** as an abstraction layer over TypeORM repositories to facilitate testing and potential database swaps.
- Entities should be registered in their respective modules using `TypeOrmModule.forFeature()`.

### Code Style

- Follow standard NestJS naming conventions: `name.type.ts` (e.g., `user.service.ts`).
- Use private members with an underscore prefix (e.g., `private _userService: UserService`) for dependency injection.
- Ensure all public API endpoints are documented in the corresponding `SPECIFICATION.md` if applicable.
