import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GenericSimpleResult } from 'src/utils/generic-simple-result.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly utilsService: UtilsService,
    private readonly result: GenericSimpleResult,
  ) {}

  async create(user: CreateUserDto): Promise<User | GenericSimpleResult> {
    try {
      const query = `
        INSERT INTO users (name, email, password, active, created_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const values = [
        user.name,
        user.email,
        user.password,
        user.active,
        this.utilsService.formatsToBrazilianLocalDateTime(),
      ];

      const createdUser: User[] = await this.dataSource.query(query, values);

      if (!createdUser.length) {
        this.result.message = 'Não foi possível criar o novo usuário';
        return this.result;
      }

      return createdUser[0];
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${(error as Error).message}`);
    }
  }

  async findAllActiveUsers(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users WHERE active = true`;
      const users: User[] = await this.dataSource.query(query);

      if (!users.length) {
        this.result.message = `Não foi possível retornar a lista de usuários ativos`;
        return [];
      }

      const activeUsers = users.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        active: row.active,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      return activeUsers;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${(error as Error).message}`);
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const query = `SELECT * FROM users`;
      const users: User[] = await this.dataSource.query(query);

      if (!users.length) {
        this.result.message = `Não foi possível retornar a lista de usuários`;
        return [];
      }

      const allUsers = users.map((row) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        active: row.active,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      }));

      return allUsers;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${(error as Error).message}`);
    }
  }

  async findById(id: string): Promise<User | GenericSimpleResult> {
    try {
      const query = `SELECT * FROM users WHERE id = $1 WHERE active = true`;
      const userExists: User[] = await this.dataSource.query(query, [id]);

      if (!userExists.length) {
        this.result.message = `Usuário com id ${id} não localizado`;
      }
      const row = userExists[0];

      const user: User = {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        active: row.active,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
      return user;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário: ${(error as Error).message}`);
    }
  }

  async update(
    id: string,
    user: Partial<UpdateUserDto>,
  ): Promise<User | GenericSimpleResult> {
    try {
      const query = `
        UPDATE users
        SET name = $1, email = $2, password = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING *;
      `;

      const values = [user.name, user.email, user.password, id];

      const updatedUser: User[] = await this.dataSource.query(query, values);
      if (!updatedUser.length) {
        this.result.message = 'Não foi possível atualizar o usuário';
      }
      return updatedUser[0];
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${(error as Error).message}`);
    }
  }

  async deactivate(id: string): Promise<GenericSimpleResult> {
    try {
      const query = `
        UPDATE users
        SET active = false
        WHERE id = $1
        RETURNING *;
      `;
      const values = [id];
      const deactivatedUser: User[] = await this.dataSource.query(
        query,
        values,
      );
      if (!deactivatedUser.length) {
        this.result.message = 'Não foi possível excluir o usuário';
      }
      this.result.success = true;
      this.result.message = 'Usuário excluído com sucesso';
      return this.result;
    } catch (error) {
      throw new Error(`Erro ao excluir usuário: ${(error as Error).message}`);
    }
  }

  async activate(id: string): Promise<User | GenericSimpleResult> {
    try {
      const query = `
        UPDATE users
        SET active = true
        WHERE id = $1
        RETURNING *;
      `;
      const values = [id];
      const activatedUser: User[] = await this.dataSource.query(query, values);
      if (!activatedUser.length) {
        this.result.message = 'Não foi possível reativar o usuário';
      }
      return activatedUser[0];
    } catch (error) {
      throw new Error(`Erro ao ativar usuário: ${(error as Error).message}`);
    }
  }
}
