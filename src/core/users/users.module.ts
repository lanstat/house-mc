import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserController } from './controllers/users.controller';
import { MeController } from './controllers/me.controller';
import { RoleService } from './services/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { UserProvider } from './providers/user.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  controllers: [UserController, MeController],
  providers: [UsersService, RoleService, UserProvider],
  exports: [UsersService],
})
export class UsersModule {}
