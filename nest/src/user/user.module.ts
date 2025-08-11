import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HelloModule } from 'src/hello/hello.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports:[HelloModule]
})
export class UserModule {}
