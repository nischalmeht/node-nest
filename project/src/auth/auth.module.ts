import { ConflictException, Module, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/user.entities';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategies';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  controllers: [AuthController],
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {

}
