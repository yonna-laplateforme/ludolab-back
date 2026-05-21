import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get() // ◄ Capte les requêtes sur http://localhost:3000/
  getHello(): string {
    return 'Bienvenue sur l\'API de LudoLab ! 🚀';
  }
}