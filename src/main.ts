import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Permet à ton front de se connecter à ton API (très utile pour la suite)
  app.enableCors({
    origin: 'http://localhost:3001', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });


  await app.listen(3000);
  console.log('🚀 Le serveur NestJS tourne sur : http://localhost:3000');
}
bootstrap();