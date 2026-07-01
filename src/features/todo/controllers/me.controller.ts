import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { Request as ExpressRequest } from 'express';
import { Priority, Task } from '../models/task.model';
import { plainToInstance } from 'class-transformer';

interface RequestWithUser extends ExpressRequest {
  user: {
    sub: number;
    username: string;
  };
}

@Controller('me/todo')
export class MeTodoController {
  constructor(private readonly _service: TaskService) {}

  @Post()
  create(
    @Body('title') title: string,
    @Body('isPublic') isPublic: boolean,
    @Body('priority') priority: Priority,
    @Body('dueDate') dueDate: string,
    @Body('projectId') projectId: number,
    @Request() req: RequestWithUser,
  ) {
    return this._service.create(
      plainToInstance(Task, {
        title,
        isPublic,
        priority: priority || Priority.NORMAL,
        completed: false,
        dueDate: dueDate ? new Date(dueDate) : null,
        user: {
          id: req.user.sub,
        },
        project: projectId
          ? {
              id: projectId,
            }
          : null,
      }),
    );
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    return this._service.findAllByUser(userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: string,
    @Body('priority') priority: Priority,
    @Body('dueDate') dueDate: string,
    @Body('projectId') projectId: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.update(
      id,
      userId,
      plainToInstance(Task, {
        title,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        project: projectId
          ? {
              id: projectId,
            }
          : null,
      }),
    );
  }

  @Patch(':id/status')
  toggleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.toggleStatus(id, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.remove(id, userId);
  }
}
