import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async signup(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user.length) {
      throw new BadRequestException('Email already in use');
    }
    // Generate a salt
    const salt = randomBytes(9).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    // Join the hashed result and the salt together
    const pwd = `${hash.toString('hex')}.${salt}`;
    // Create a new user and save it
    const newUser = await this.usersService.create(email, pwd);
    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const [hashedPassword, salt] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hashedPassword !== hash.toString('hex')) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }

  async updatePassword(id: number, body: any) {
    const salt = randomBytes(9).toString('hex');
    const hash = (await scrypt(body.password, salt, 32)) as Buffer;
    const pwd = `${hash.toString('hex')}.${salt}`;
    const user = await this.usersService.update(id, { password: pwd });
    return user;
  }
}
