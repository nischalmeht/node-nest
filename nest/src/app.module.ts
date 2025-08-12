import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './hello/hello.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
// import { JwtModule } from '@nestjs/jwt';
@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [appConfig],
    }),

    HelloModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
