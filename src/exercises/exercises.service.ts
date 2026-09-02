import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto'

@Injectable()
export class ExerciseService {
  constructor(private prisma: PrismaService) {}

  async create(createExerciseDto: CreateExerciseDto) {
    return this.prisma.exercise.create({
      data: createExerciseDto,
      include: {
        subjects: true,
        progression: true,
      },
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany({
      orderBy: { id: 'desc' },
      include: {
        subjects: true,
        progression: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.exercise.findUnique({
      where: { id },
      include: {
        subjects: true,
        progression: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.exercise.delete({
      where: { id },
    });
  }
}
