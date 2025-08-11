import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    
  constructor(private readonly helloService: HelloService) {}

  getAllUsers() {
    return [
      {
        id: 1,
        name: 'Sangam',
      },
      {
        id: 2,
        name: 'John',
      },
      {
        id: 3,
        name: 'Victor',
      },
    ];
  }
  getUserbyId(id: number) {
    const user = this.getAllUsers().find((user) => user.id === id);
    return user;
  }
  getWelcomeMessage(userId: number) {
    const user = this.getUserbyId(userId);

    if (!user) {
      return 'User not found!';
    }

    return this.helloService.getHelloWithName(user?.name);
  }
}
