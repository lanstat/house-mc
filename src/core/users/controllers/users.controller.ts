import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../models/user.model';

import { Public } from '../../auth/auth.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly _service: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  list() {
    return this._service.findAll();
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('')
  create(
    @Body()
    request: {
      userId: number;
      username: string;
      password: string;
    },
  ) {
    const user = new User();
    user.id = request.userId;
    user.username = request.username;
    user.password = request.password;

    return this._service.create(user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param() params: { id: string }) {
    return this._service.delete(parseInt(params.id, 10));
  }
}
