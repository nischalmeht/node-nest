import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorater';
import { UserRole } from '../entities/user.entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // const request = context.switchToHttp().getRequest();
    
    // const user = request.user as { role?: UserRole } | undefined;

    // if (!user?.role) {
    //   throw new ForbiddenException('Missing role');
    // }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    // const isAllowed = requiredRoles.includes(user.
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Insufficient permission');
    }
    return true;
  }
}


