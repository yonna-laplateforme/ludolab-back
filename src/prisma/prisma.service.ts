import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    console.log('⏳ Connexion à la base de données MySQL...');
    await this.$connect();
    console.log('✅ Prisma est connecté avec succès à MySQL !');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}