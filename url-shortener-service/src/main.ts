import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { processEnvSchema } from './environments.schema';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  processEnvSchema.parse(process.env);
  const config = new DocumentBuilder()
    .setTitle('Url Shortener API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(8000, () => {
    const logger = new Logger('SERVER');
    logger.log('Server is ready');
  });
}
bootstrap();
