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
        subjects: true
      }
    });
  }

  async findAll() {
    return this.prisma.exercise.findMany(); // ◄ Ajout du "s"
  }

  async findOne(id: number) {
    return this.prisma.exercise.findUnique({
      // ◄ Ajout du "s"
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.exercise.delete({
      // ◄ Ajout du "s"
      where: { id },
    });
  }
}
