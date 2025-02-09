import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class ValidateFieldsService {
  validateFields(user: CreateUserDto) {
    if (!user.name) {
      throw new BadRequestException("O campo 'nome' não pode estar vazio");
    }
    if (!user.email) {
      throw new BadRequestException("O campo 'email' não pode estar vazio");
    }
    if (!user.password) {
      throw new BadRequestException("O campo 'senha' não pode estar vazio");
    }
    if (user.active && typeof user.active !== 'boolean') {
      throw new BadRequestException("O campo 'active' deve ser true ou false");
    }
  }
}
