import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE
  async create(data: { name: string; icon: string }) {
    return this.prisma.subjects.create({
      data: {
        name: data.name,
        icon: data.icon,
      },
    });
  }

  // 2. READ ALL
  async findAll() {
    return this.prisma.subjects.findMany();
  }

  // 2. READ ONE
  async findOne(id: number) {
    const subject = await this.prisma.subjects.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Le sujet avec l'ID #${id} n'existe pas.`);
    }

    return subject;
  }

  // 3. UPDATE
  async update(id: number, data: { name?: string; icon?: string }) {
    await this.findOne(id); // Vérifie s'il existe

    return this.prisma.subjects.update({
      where: { id },
      data,
    });
  }

  // 4. DELETE
  async remove(id: number) {
    await this.findOne(id); // Vérifie s'il existe

    return this.prisma.subjects.delete({
      where: { id },
    });
  }
}