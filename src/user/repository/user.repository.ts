import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly dataSource: DataSource,
    private readonly utilsService: UtilsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | string> {
    const emailAlreadyInUse = await this.findByEmail(createUserDto.email);
    if (typeof emailAlreadyInUse != 'string')
      return 'Email já em uso por outro usuário';

    const query = `
        INSERT INTO users (name, email, password, active, created_at) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      createUserDto.active !== undefined ? createUserDto.active : true,
      this.utilsService.formatsToBrazilianLocalDateTime(),
    ];

    const createdUser: User[] = await this.dataSource.query(query, values);

    if (!createdUser || createdUser.length == 0)
      return 'Não foi possível criar o novo usuário';

    return createdUser[0];
  }

  async findById(id: string): Promise<User | string> {
    const query = `SELECT * FROM users WHERE id = $1;`;

    const values = [id];

    const userFound: User[] = await this.dataSource.query(query, values);

    if (!userFound.length) return 'Não foi possível criar o novo usuário';
    return userFound[0];
  }

  async findByEmail(email: string): Promise<User | string> {
    const query = `
        SELECT * FROM users WHERE email = $1;
      `;

    const values = [email];

    const userFound: User[] = await this.dataSource.query(query, values);

    if (!userFound || userFound.length == 0)
      return 'Não foi localizar o usuário pelo e-mail informado';
    return userFound[0];
  }

  async findAllActiveUsers(): Promise<User[] | string> {
    const query = `SELECT * FROM users WHERE active = true;`;

    const activeUsers: User[] = await this.dataSource.query(query);

    if (!activeUsers.length) return [];
    return activeUsers;
  }

  async findAllUsers(): Promise<User[] | string> {
    const query = `SELECT * FROM users;`;

    const users: User[] = await this.dataSource.query(query);

    if (!users.length) return [];
    return users;
  }

  async update(user: User): Promise<User | string> {
    const userFound = await this.findById(user.id);
    if (typeof userFound == 'string' || userFound.active == false)
      return 'Usuário desativado ou não encontrado para atualização';

    const otherUser = await this.findByEmail(user.email);

    if (otherUser && typeof otherUser !== 'string' && otherUser.id != user.id)
      return 'Esse e-mail já está em uso por outro usuário';

    const query = `UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE id = $5 RETURNING *;`;

    const values = [
      user.name,
      user.email,
      user.password,
      this.utilsService.formatsToBrazilianLocalDateTime(),
      user.id,
    ];

    const updatedUser: User[] = await this.dataSource.query(query, values);

    return updatedUser[0];
  }

  async deactivate(id: string): Promise<string> {
    const userFound = await this.findById(id);
    if (typeof userFound != 'string' && userFound.active == false)
      return 'Usuário já se encontra inativo';
    const query = `UPDATE users SET updated_at = $1, active = false WHERE id = $2;`;
    const values = [this.utilsService.formatsToBrazilianLocalDateTime(), id];
    await this.dataSource.query(query, values);
    return 'Usuário excluido com sucesso';
  }

  async activate(id: string): Promise<User | string> {
    const userFound = await this.findById(id);
    if (typeof userFound != 'string' && userFound.active == true)
      return 'Usuário já se encontra ativo';
    const query = `UPDATE users SET updated_at = $1, active = true WHERE id = $2;`;
    const values = [this.utilsService.formatsToBrazilianLocalDateTime(), id];
    await this.dataSource.query(query, values);
    return 'Usuário ativo com sucesso';
  }
}
