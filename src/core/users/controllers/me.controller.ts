import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('me')
export class MeController {
  constructor(private readonly _service: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('')
  getProfile(@Request() req: any) {
    return this._service.findOne(req.user.username);
  }
}
