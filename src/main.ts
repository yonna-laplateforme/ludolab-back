import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Permet à ton front de se connecter à ton API (très utile pour la suite)
  app.enableCors();

  // Ton serveur va écouter sur le port 3000
  await app.listen(3000);
  console.log('🚀 Le serveur NestJS tourne sur : http://localhost:3000');
}
bootstrap();