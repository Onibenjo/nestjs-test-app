import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../user.entity';
import { UsersService } from '../users.service';

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: User;
//     }
//   }
// }

interface IRequest extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: IRequest, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }

  //   resolve(...args: any[]): any {
  //     return async (req, res, next) => {
  //       const { userId } = req.session || {};

  //       if (userId) {
  //         const user = await this.userService.findOne(userId);
  //         req.currentUser = user;
  //       }

  //       next();
  //     };
  //   }
}
