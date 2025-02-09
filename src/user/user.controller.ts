import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ValidateFieldsService } from './validate-fields/validate-fields.service';

@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly validations: ValidateFieldsService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.validations.validateFields(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

  @Get('by-email')
  getByEmail(@Body() email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Get('all-active-users')
  getAllActive() {
    return this.userService.findAllActiveUsers();
  }

  @Get('all-users')
  getAll() {
    return this.userService.findAllUsers();
  }

  @Patch()
  update(@Body() user: User) {
    return this.userService.updateUser(user);
  }

  @Patch('recover')
  recover(@Body() body: { id: string }) {
    return this.userService.recoverUser(body.id);
  }

  @Delete()
  remove(@Body() body: { id: string }) {
    return this.userService.removeUser(body.id);
  }
}
