import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(identifier: string, password: string): Promise<any> {
    console.log('OK');
    const user = await this.UsersService.findByIdentifier(identifier);
    if (user != null) {
      console.log(await bcrypt.compare(password, user.password));
    }
    if (user == null)
    {
      throw new NotFoundException("Identifiants incorrect")
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = {
        username: user.username,
        id: user.id,
      };
      console.log(payload);
      return {
        access_tokken: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET'), // <-- On l'utilise ici
        }),
      };
    }
  }
}
