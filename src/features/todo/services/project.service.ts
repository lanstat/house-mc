import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Project } from '../models/project.model';
import { ProjectProvider } from '../providers/project.provider';

@Injectable()
export class ProjectService {
  constructor(private readonly _provider: ProjectProvider) {}

  create(record: Project): Promise<Project> {
    return this._provider.create(record);
  }

  findAllByUser(userId: number): Promise<Project[]> {
    return this._provider.findAllByUser(userId);
  }

  async findOne(id: number, userId: number): Promise<Project> {
    const project = await this._provider.findOne(id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  update(record: Project, userId: number): Promise<Project> {
    return this._provider.update(record.id, {
      name: record.name,
    });
  }

  remove(id: number, userId: number) {
    return this._provider.delete(id);
  }
}
