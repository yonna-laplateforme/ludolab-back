import { Injectable } from '@nestjs/common';
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
    birthday: Date;
    country: string;
    postal_code: string;
    adress: string;
  }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        first_name: data.first_name, // ◄ Ajouté
        last_name: data.last_name, // ◄ Ajouté
        password: hashedPassword,
        role: data.role,
        birthday: new Date(data.birthday),
        country: data.country,
        postal_code: data.postal_code,
        adress: data.adress
      },
    });
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
