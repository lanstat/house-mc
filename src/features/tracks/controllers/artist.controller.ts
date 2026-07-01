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
import { ArtistService } from '../services/artist.service';
import { Artist } from '../models/artist.model';
import { plainToInstance } from 'class-transformer';

@Controller('api/artists')
export class ArtistController {
  constructor(private readonly _service: ArtistService) {}

  @Post()
  create(@Body('name') name: string) {
    const artist = new Artist();
    artist.name = name;
    return this._service.create(artist);
  }

  @Get()
  findAll() {
    return this._service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this._service.update(id, { name });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this._service.remove(id);
  }
}
