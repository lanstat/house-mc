import { Module } from '@nestjs/common';
import { UsersModule } from '../../core/users/users.module';
import { MeTodoController } from './controllers/me.controller';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { TaskEntity } from './entities/task.entity';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { TaskListeners } from './listeners/task.listeners';
import { TaskProvider } from './providers/task.provider';
import { ProjectProvider } from './providers/project.provider';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, TaskEntity]), UsersModule],
  controllers: [TaskController, MeTodoController, ProjectController],
  providers: [
    TaskService,
    ProjectService,
    ProjectProvider,
    TaskListeners,
    TaskProvider,
  ],
})
export class TodoModule {}
