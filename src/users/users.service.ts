import { Injectable, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  // 1. CREATE

  async create(data: {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    role: string;
    birthday: Date | string;
    phone_number?: string;
    country: string;
    postal_code: string;
    adress: string;
  }) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);

      return await this.prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          password: hashedPassword,
          role: data.role || 'user',
          birthday: new Date(data.birthday),
          phone_number: data.phone_number,
          country: data.country,
          postal_code: data.postal_code,
          adress: data.adress,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        const target = error.meta?.target;
        if (target && target.includes('email')) {
          throw new ConflictException('Cette adresse e-mail est déjà utilisée par un autre compte.');
        }
        throw new ConflictException('Un compte avec ces identifiants existe déjà.');
      }
      throw error;
    }
  }

  // 2. READ ALL
  async findAll() {
    return this.prisma.user.findMany();
  }

  // 2. READ ONE
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  // 2. READ BY EMAIL
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // 2. READ BY IDENTIFIER
  async findByIdentifier(identifier: string) {
    console.log(identifier)
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }

  // 3. UPDATE
  async update(id: number, data: { email?: string; username?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // 4. DELETE
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
