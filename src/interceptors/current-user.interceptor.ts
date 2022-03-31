import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

// interceptors run after middleware and guard against
// so the middleware/guard can't access this interceptor
// so they do not have access to the currentUser object
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = this.userService.findOne(userId);
      request.currentUser = user;
    }

    return handler.handle();
  }
}
