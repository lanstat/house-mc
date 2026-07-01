import { Controller, Get } from '@nestjs/common';
import { TaskService } from './../services/task.service';
import { Public } from '../../../core/auth/auth.decorator';

@Controller('todo/tasks')
export class TaskController {
  constructor(private readonly _service: TaskService) {}

  @Public()
  @Get('')
  findAllPublic() {
    return this._service.findAllPublic();
  }
}
