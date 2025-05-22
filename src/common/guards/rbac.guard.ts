import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/schemas/user.schema';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const method = req.method;

    const user = req.user;
    if (!user) return true;
    const role: UserRole = user.role;

    if (!role) throw new ForbiddenException('Missing user role');

    switch (role) {
      case UserRole.Admin:
        return true;
      case UserRole.Editor:
        if (['GET', 'PATCH'].includes(method)) return true;
        break;
      case UserRole.Viewer:
        if (method === 'GET') return true;
        break;
    }

    throw new ForbiddenException(`Access denied for role: ${role}`);
  }
}
