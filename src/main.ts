import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permet à ton front de se connecter à ton API (très utile pour la suite)
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Ludolab API')
    .setDescription(
      "Documentation officielle de l'API Ludolab avec intégration IA",
    )
    .setVersion('1.0')
    .addTag('exercises') // Regroupe tes routes sous un tag
    .build();

  // 2. Génération du document et création du endpoint '/api'
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('🚀 Le serveur NestJS tourne sur : http://localhost:3001');
  console.log(
    '📖 La documentation Swagger est disponible sur : http://localhost:3001/api',
  );
}
bootstrap();
