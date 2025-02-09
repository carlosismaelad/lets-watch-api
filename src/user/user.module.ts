import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ValidateFieldsService } from './validate-fields/validate-fields.service';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UtilsService } from 'src/utils/utils.service';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UtilsService, UserService, UserRepository, ValidateFieldsService],
  exports: [],
})
export class UserModule {}
