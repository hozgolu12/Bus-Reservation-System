import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: 'http://django-api:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/auth': '/api/auth' },
    }),
  );

  app.use(
    '/api/admin',
    createProxyMiddleware({
      target: 'http://django-api:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/admin': '/api/admin' },
    }),
  );

  app.use(
    '/api/user',
    createProxyMiddleware({
      target: 'http://django-api:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/user': '/api/user' },
    }),
  );

  app.use(
    '/api/tickets',
    createProxyMiddleware({
      target: 'http://bookings-service:8001',
      changeOrigin: true,
      pathRewrite: { '^/api/tickets': '/api/tickets' },
    }),
  );

  app.use(
    '/api/buses',
    createProxyMiddleware({
      target: 'http://buses-service:3003',
      changeOrigin: true,
      pathRewrite: { '^/api/buses': '/api/buses' },
    }),
  );

  app.use(
    '/api/routes',
    createProxyMiddleware({
      target: 'http://routes-service:3004',
      changeOrigin: true,
      pathRewrite: { '^/api/routes': '/api/routes' },
    }),
  );

  app.use(
    '/api/operator/buses',
    createProxyMiddleware({
      target: 'http://buses-service:3003',
      changeOrigin: true,
      pathRewrite: { '^/api/operator/buses': '/api/operator/buses' },
    }),
  );

  app.use(
    '/api/operator/routes',
    createProxyMiddleware({
      target: 'http://routes-service:3004',
      changeOrigin: true,
      pathRewrite: { '^/api/operator/routes': '/api/operator/routes' },
    }),
  );

  app.use(
    '/api/operator/profile',
    createProxyMiddleware({
      target: 'http://django-api:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/operator/profile': '/api/operator/profile' },
    }),
  );

  app.use(
    '/api/operator/delete',
    createProxyMiddleware({
      target: 'http://django-api:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/operator/delete': '/api/operator/delete' },
    }),
  );

  app.use(
    '/api/operator/dashboard/stats',
    createProxyMiddleware({
      target: 'http://django-api:8000',
      changeOrigin: true,
      pathRewrite: { '^/api/operator/dashboard/stats': '/api/operator/dashboard/stats' },
    }),
  );

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();