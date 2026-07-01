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
import { ProjectService } from '../services/project.service';
import { Request as ExpressRequest } from 'express';
import { plainToClass } from 'class-transformer';
import { Project } from '../models/project.model';

interface RequestWithUser extends ExpressRequest {
  user: {
    sub: number;
    username: string;
  };
}

@Controller('me/projects')
export class ProjectController {
  constructor(private readonly _service: ProjectService) {}

  @Post()
  create(@Body('name') name: string, @Request() req: RequestWithUser) {
    const userId = req.user.sub;
    return this._service.create(
      plainToClass(Project, {
        name,
        user: {
          id: userId,
        },
      }),
    );
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    const userId = req.user.sub;
    return this._service.findAllByUser(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.update(
      plainToClass(Project, {
        id,
        name,
      }),
      userId,
    );
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
