import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('/register')
  registerUser(): any {}

  @Post('/login')
  logUser(): any {}
}
