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
import { Request as ExpressRequest } from 'express';
import { PlaylistService } from '../services/playlist.service';

interface RequestWithUser extends ExpressRequest {
  user: {
    sub: number;
    username: string;
  };
}

@Controller('api/me/playlists')
export class PlaylistController {
  constructor(private readonly _service: PlaylistService) {}

  @Post()
  create(
    @Body('name') name: string,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.create(name, userId);
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
    return this._service.update(id, userId, name);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.remove(id, userId);
  }

  @Post(':id/tracks')
  addTrack(
    @Param('id', ParseIntPipe) id: number,
    @Body('trackId', ParseIntPipe) trackId: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.addTrack(id, userId, trackId);
  }

  @Delete(':id/tracks/:trackId')
  removeTrack(
    @Param('id', ParseIntPipe) id: number,
    @Param('trackId', ParseIntPipe) trackId: number,
    @Request() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this._service.removeTrack(id, userId, trackId);
  }
}
