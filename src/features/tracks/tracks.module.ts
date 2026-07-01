import { Module } from '@nestjs/common';
import { UsersModule } from '../../core/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

// Music Feature imports
import { ArtistEntity } from './entities/artist.entity';
import { AlbumEntity } from './entities/album.entity';
import { TrackEntity } from './entities/track.entity';
import { PlaylistEntity } from './entities/playlist.entity';

import { ArtistController } from './controllers/artist.controller';
import { AlbumController } from './controllers/album.controller';
import { TrackController } from './controllers/track.controller';
import { PlaylistController } from './controllers/playlist.controller';

import { ArtistProvider } from './providers/artist.provider';
import { AlbumProvider } from './providers/album.provider';
import { TrackProvider } from './providers/track.provider';
import { PlaylistProvider } from './providers/playlist.provider';

import { ArtistService } from './services/artist.service';
import { AlbumService } from './services/album.service';
import { TrackService } from './services/track.service';
import { PlaylistService } from './services/playlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArtistEntity,
      AlbumEntity,
      TrackEntity,
      PlaylistEntity,
    ]),
    UsersModule,
  ],
  controllers: [
    ArtistController,
    AlbumController,
    TrackController,
    PlaylistController,
  ],
  providers: [
    ArtistProvider,
    AlbumProvider,
    TrackProvider,
    PlaylistProvider,
    ArtistService,
    AlbumService,
    TrackService,
    PlaylistService,
  ],
})
export class TrackModule { }

