import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  // 1. Créer
  async create(data: { name: string; icon: string }) {
    return this.prisma.subject.create({
      data: {
        name: data.name,
        icon: data.icon,
      },
    });
  }

  // 1b. Trouver ou créer par nom
  async findOrCreateByName(name: string, defaultIcon = 'book') {
    const trimmed = (name || 'Général').trim();
    const existing = await this.prisma.subject.findFirst({
      where: {
        name: {
          contains: trimmed,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.subject.create({
      data: {
        name: trimmed,
        icon: defaultIcon,
      },
    });
  }

  // 2. Recuperer tout
  async findAll() {
    return this.prisma.subject.findMany();
  }

  // 2. recuperé par id
  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Le sujet avec l'ID #${id} n'existe pas.`);
    }

    return subject;
  }

  // 3. modifier
  async update(id: number, data: { name?: string; icon?: string }) {
    await this.findOne(id); 

    return this.prisma.subject.update({
      where: { id },
      data,
    });
  }

  // 4. Supprimer
  async remove(id: number) {
    await this.findOne(id); 

    return this.prisma.subject.delete({
      where: { id },
    });
  }
}