import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.repository.create(createUserDto);
  }

  async findAllUsers() {
    return await this.repository.findAllUsers();
  }

  async findAllActiveUsers() {
    return await this.repository.findAllActiveUsers();
  }

  async findUserById(id: string) {
    return await this.repository.findById(id);
  }

  async findUserByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }

  async updateUser(user: User) {
    return await this.repository.update(user);
  }

  async removeUser(id: string) {
    return await this.repository.deactivate(id);
  }

  async recoverUser(id: string) {
    return await this.repository.activate(id);
  }
}
