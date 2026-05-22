import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AiInteractionsService {
      constructor(private prisma: PrismaService) {}
    
      async create(data: {
          user_id: number;
          exercise_id: number;
          user_question: string;
          ai_response: string;
          help_type: string;
      }) {
        return this.prisma.aiInteraction.create({
          // ◄ Ajout du "s"
          data: data,
        });
      }
    
      async findAll() {
        return this.prisma.aiInteraction.findMany(); // ◄ Ajout du "s"
      }
    
      async findOne(id: number) {
        return this.prisma.aiInteraction.findUnique({
          // ◄ Ajout du "s"
          where: { id },
        });
      }
    
      async remove(id: number) {
        return this.prisma.aiInteraction.delete({
          // ◄ Ajout du "s"
          where: { id },
        });
      }
}
