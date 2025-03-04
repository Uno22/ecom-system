import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../constants/enum';
import {
  UserForbiddenException,
  UserUnauthorizedException,
} from '../exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UserUnauthorizedException();
    }

    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (!requiredRoles.includes(user.role)) {
      throw new UserForbiddenException();
    }

    return true;
  }
}
