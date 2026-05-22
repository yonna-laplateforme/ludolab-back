import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE
 
async create(data: { email: string; username: string; first_name: string; last_name: string }) {
  return this.prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      first_name: data.first_name, // ◄ Ajouté
      last_name: data.last_name,   // ◄ Ajouté
      password: 'password_temporaire', 
      role: 'user',
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