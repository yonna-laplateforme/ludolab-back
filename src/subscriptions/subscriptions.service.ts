import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
    constructor(private prisma : PrismaService){}
    async create(data:{
        user_id: number;
        plan_name:string;
        is_active:boolean;
        start_date:Date;
        end_date:Date
    }){
        return this.prisma.subscription.create({
            data: data,
        })
    }
      async findAll() {
    return this.prisma.subscription.findMany(); // ◄ Ajout du "s"
  }

  async findOne(id: number) {
    return this.prisma.subscription.findUnique({
      // ◄ Ajout du "s"
      where: { id },
    });
  }

  async remove(id: number) {
    return this.prisma.subscription.delete({
      // ◄ Ajout du "s"
      where: { id },
    });
  }
}
