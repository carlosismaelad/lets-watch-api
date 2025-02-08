import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UtilsService } from 'src/utils/utils.service';
import { UserRepository } from './repository/user.repository';
import { GenericSimpleResult } from 'src/utils/generic-simple-result.service';

@Module({
  imports: [UtilsService, GenericSimpleResult],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
