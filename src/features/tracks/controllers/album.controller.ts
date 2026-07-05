import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AlbumService } from '../services/album.service';
import { ArtistService } from '../services/artist.service';
import { Album } from '../models/album.model';

@Controller('api/albums')
export class AlbumController {
  constructor(
    private readonly _service: AlbumService,
    private readonly _artistService: ArtistService,
  ) { }

  @Get()
  findAll() {
    return this._service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name?: string,
  ) {
    const updateData: Partial<Album> = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    return this._service.update(id, updateData);
  }
}
