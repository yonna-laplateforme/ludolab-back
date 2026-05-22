import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExerciseService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    user_id: number;
    subject_id: number;
    image_path: string;
    title: string;
    level: string;
  }) {
    return this.prisma.exercises.create({
      // ◄ Ajout du "s"
      data: data,
    });
  }

  async findAll() {
    return this.prisma.exercises.findMany(); // ◄ Ajout du "s"
  }

  async findOne(id: number) {
    return this.prisma.exercises.findUnique({
      // ◄ Ajout du "s"
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.exercises.delete({
      // ◄ Ajout du "s"
      where: { id },
    });
  }
}
