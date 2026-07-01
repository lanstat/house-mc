import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/auth/auth.guard';
import { TodoModule } from './features/todo/todo.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'music.db',
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
