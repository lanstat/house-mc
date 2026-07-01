# Todo & Project Feature Specification

This document details the business rules and technical implementation of the `todo` and `project` features in the `food-backend`.

## Business Rules

### Todos
1.  **Ownership**: 
    - Each task belongs to a specific user.
    - Only the owner can modify (edit content, toggle status) or delete their tasks.
    - A user can list all their tasks (both public and private).

2.  **Visibility**:
    - Tasks can be either **Public** or **Private**.
    - **Private tasks** are only visible to the owner.
    - **Public tasks** are visible to any user, including unauthenticated ones (if allowed by the `@Public()` decorator).
    - Public tasks must display the state (completed/pending) and the username of the owner.

3.  **Task States**:
    - A task can be either **Completed** or **Pending**.
    - By default, new tasks are created as **Pending**.

4.  **Properties**:
    - **Priority**: A task can have a priority level: `low`, `normal`, or `high`. Default is `normal`.
    - **Due Date**: A task can optionally have a expiration/due date.
    - **Project**: A task can optionally be associated with a project.

5.  **Lifecycle Integration**:
    - **User Creation**: When a new user is created, a mandatory private task titled "Cambiar password" is automatically assigned to them.
    - **User Deletion**: When a user is deleted, all tasks associated with that user are permanently removed from the system.

### Projects
1.  **Ownership**:
    - Each project belongs to a specific user.
    - Only the owner can view, modify, or delete their projects.
2.  **Organization**:
    - Projects are used to group related todos.
    - A project consists of an ID and a name.

## Technical Implementation

### Storage
- Tasks and Projects are stored in-memory within their respective services (`TodoService`, `ProjectService`).
- IDs are auto-incremented.

### Event Listeners

| Event | Listener | Action |
| :--- | :--- | :--- |
| `user.created` | `TodoListeners.handleUserCreatedEvent` | Creates a "Cambiar password" task for the new user. |
| `user.deleted` | `TodoListeners.handleUserDeletedEvent` | Deletes all tasks belonging to the deleted user. |

### Endpoints

#### Todos

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/me/todo` | JWT | Creates a new task. Body: `{ "title": string, "isPublic": boolean, "priority"?: string, "dueDate"?: string, "projectId"?: number }`. |
| `GET` | `/me/todo` | JWT | Lists all tasks belonging to the logged-in user. |
| `GET` | `/todo` | Public | Lists all public tasks from all users. |
| `PATCH` | `/me/todo/:id` | JWT | Updates task details. Body: `{ "title"?: string, "priority"?: string, "dueDate"?: string, "projectId"?: number }`. |
| `PATCH` | `/me/todo/:id/status` | JWT | Toggles the completion status of a task. |
| `DELETE` | `/me/todo/:id` | JWT | Deletes a task. |

#### Projects

| Method | Path | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/me/projects` | JWT | Creates a new project. Body: `{ "name": string }`. |
| `GET` | `/me/projects` | JWT | Lists all projects belonging to the logged-in user. |
| `GET` | `/me/projects/:id` | JWT | Gets a specific project. |
| `PATCH` | `/me/projects/:id` | JWT | Updates a project name. Body: `{ "name": string }`. |
| `DELETE` | `/me/projects/:id` | JWT | Deletes a project. |

### Security
- The global `AuthGuard` ensures all routes are protected by default.
- `ForbiddenException` is thrown when a user attempts to access or modify a resource they do not own.
- `NotFoundException` is thrown when a resource with the given ID does not exist.

### Data Model

```typescript
enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  isPublic: boolean;
  priority: Priority;
  dueDate?: Date;
  projectId?: number;
};

type Project = {
  id: number;
  name: string;
  userId: number;
};
```
