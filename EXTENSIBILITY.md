# Extensibility Guide

This document outlines the rules and mechanisms for extending the `food-backend` application. It serves as a reference for developers and a context guide for AI agents.

## Project Structure & Architecture

The project follows a strict layered architecture within each module. Every feature or core module should adhere to the following directory structure:

### Standard Module Directory Structure
*   `controllers/`: API endpoint definitions using NestJS decorators.
*   `services/`: Business logic. They orchestrate data flow using providers and emit events.
*   `providers/`: Data access layer. These classes bridge the gap between TypeORM entities and domain models.
*   `entities/`: TypeORM entity definitions (`*.entity.ts`). These represent the database schema.
*   `models/`: Domain models and DTOs (`*.model.ts`). These are the plain TypeScript classes used throughout the application and for API responses.
*   `events/` or `listeners/`: Definitions for events emitted by the module or listeners for external events.

### The Entity-Provider-Model Pattern
To maintain a clean separation between the database schema and the application's domain logic, we use the following flow:
1.  **Entity**: A class decorated with TypeORM's `@Entity` that maps exactly to a database table.
2.  **Model**: A clean TypeScript class (often with `class-transformer` decorators) that represents the object in the application.
3.  **Provider**: A service that injects the TypeORM Repository. It is responsible for:
    *   Querying the database using the Repository.
    *   Mapping `Entity` results to `Model` instances using `plainToInstance`.
    *   Converting `Model` instances back to `Entity` data for persistence using `instanceToPlain`.

## Feature Development Rules

1.  **Modular Structure**: All new business features must be placed in the `src/features/` directory. Each feature should be encapsulated within its own NestJS module.
2.  **Core Dependency**: Features should depend on the `src/core/` modules for shared functionality (e.g., Auth, Users). Avoid circular dependencies between features.
3.  **Authentication**: By default, all routes are protected by the global `AuthGuard`. New feature controllers must respect this unless explicitly marked as public.
4.  **Service Communication**: Prefer using events for cross-module communication to keep features decoupled.
5.  **Naming Conventions**:
    *   Modules: `*.module.ts` (e.g., `TodoModule`)
    *   Controllers: `*.controller.ts` (e.g., `TaskController`)
    *   Services: `*.service.ts` (e.g., `TaskService`)
    *   Providers: `*.provider.ts` (e.g., `TaskProvider`)
    *   Entities: `*.entity.ts` (e.g., `TaskEntity`)
    *   Models: `*.model.ts` (e.g., `Task`)

## Events List

The system uses `@nestjs/event-emitter` for asynchronous communication.

| Event Name | Event Class | Triggered When |
| :--- | :--- | :--- |
| `user.created` | `UserCreatedEvent` | A new user is successfully created in `UsersService`. |
| `user.deleted` | `UserDeletedEvent` | A user is removed from the system in `UsersService`. |

> **Note**: Developers should listen to these events using the `@OnEvent('event.name')` decorator in their services/listeners.

## Exclusions

### Authentication Exclusions
*   **`@Public()` Decorator**: Use this decorator to exclude specific routes or entire controllers from the global JWT authentication requirement.
    *   *Usage*: `@Public()` above a method or class in a controller.

### Structural Exclusions
*   **`src/core/`**: Core modules are intended for system-wide services. Business logic for specific features should NOT be added here.
*   **`dist/`**: This directory is excluded from source control and contains the compiled application.
*   **`.spec.ts` Files**: These are test files and are excluded from the production build.

## Guidelines for AI
*   When asked to create a new feature, always propose a new folder under `src/features/`.
*   Ensure any new controller follows the security default (Auth required).
*   Check if any action should trigger an event or listen to existing ones.
*   Always implement the Entity-Provider-Model pattern for any new data-driven feature.
