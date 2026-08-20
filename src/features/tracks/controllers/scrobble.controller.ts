import { Body, Controller, Post, Param, Get, Query } from '@nestjs/common';
import { ScrobbleService } from '../services/scrobble.service';
import { UserScrobbleDto } from '../dtos/user-scrobble.dto';

@Controller('tracks')
export class ScrobbleController {
  constructor(private readonly _scrobbleService: ScrobbleService) {}

  @Post(':id/scrobble')
  async scrobbleTrack(
    @Param('id') trackId: number,
    @Body() dto: UserScrobbleDto,
  ) {
    return this._scrobbleService.scrobble(dto.userId, trackId);
  }

  @Get(':userId/top-tracks')
  async getTopTracks(
    @Param('userId') userId: number,
    @Query('limit') limit: number = 10,
  ) {
    return this._scrobbleService.getTopTracks(userId, limit);
  }

  @Get(':userId/top-artists')
  async getTopArtists(
    @Param('userId') userId: number,
    @Query('limit') limit: number = 10,
  ) {
    return this._scrobbleService.getTopArtists(userId, limit);
  }

  @Get(':userId/recent')
  async getRecentScrobbles(
    @Param('userId') userId: number,
    @Query('limit') limit: number = 20,
  ) {
    return this._scrobbleService.getRecentScrobbles(userId, limit);
  }
}
