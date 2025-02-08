import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UtilsService } from './utils/utils.service';

@Module({
  imports: [UserModule, UtilsService],
  controllers: [AppController],
  providers: [AppService, UtilsService],
})
export class AppModule {}
