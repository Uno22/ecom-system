import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './share/filters/all-exception.filter';
import { ResponseInterceptor } from './share/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Basic E-Commerce API')
    .setDescription(
      `This is a basic E-Commerce API with the main functionality:

- Register new user.

- User login.
- Add products to cart.
- Place order.
- CRUD brand/category/product.

Notes:
- Remember to add token to secure api.

- Only the admin can delete resources.`,
    )
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: ${await app.getUrl()} ${process.env.NODE_ENV}`,
  );
}
bootstrap();
