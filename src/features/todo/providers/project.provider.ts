import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ProjectEntity } from '../entities/project.entity';
import { Project } from '../models/project.model';

export class ProjectProvider {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly _repository: Repository<ProjectEntity>,
  ) {}

  async findAll(): Promise<Project[]> {
    const records = await this._repository.find({});
    return plainToInstance(Project, records);
  }

  async findOne(id: number): Promise<Project | null> {
    const record = await this._repository.findOne({
      where: { id: id },
    });
    return plainToInstance(Project, record);
  }

  async findAllByUser(projectId: number): Promise<Project[]> {
    const record = await this._repository.find({
      where: {
        user: {
          id: projectId,
        },
      },
    });
    return plainToInstance(Project, record);
  }

  async create(record: Project): Promise<Project> {
    const entity = instanceToPlain(record);

    const project = await this._repository.save(entity);

    return plainToInstance(Project, project);
  }

  async update(id: number, record: Partial<Project>): Promise<Project> {
    const project = await this._repository.update(
      {
        id: id,
      },
      record,
    );

    return plainToInstance(Project, project);
  }

  delete(id: number) {
    return this._repository.delete({ id: id });
  }

  deleteByUser(userId: number) {
    return this._repository.delete({ user: { id: userId } });
  }
}
