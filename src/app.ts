import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { fastifySwagger } from '@fastify/swagger';
import ScalarFastifyApiReference from '@scalar/fastify-api-reference';
import Fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { BaseError } from '@/errors';
import { jwtPlugin } from '@/lib/auth';
import { authRoutes } from '@/routes/v1/auth.route';
import { usersRoutes } from '@/routes/v1/users.route';

export async function buildApplicationApp() {
  const app = Fastify({
    logger: process.env.LOGGER === 'true',
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API',
        version: '0.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(cookie);
  await app.register(rateLimit, { global: false });
  await app.register(jwtPlugin);

  app.setErrorHandler((err, _request, reply) => {
    if (hasZodFastifySchemaValidationErrors(err)) {
      return reply.code(400).send({
        errors: err.validation.map((issue) => ({
          field: issue.instancePath.replace('/', ''),
          message: issue.message,
        })),
        message: 'Validation failed',
        statusCode: 400,
      });
    }

    if (err instanceof BaseError) {
      return reply.status(err.statusCode).send({
        message: err.message,
        statusCode: err.statusCode,
      });
    }
    app.log.error(err);

    return reply.code(500).send({
      message: 'Internal server error',
      statusCode: 500,
    });
  });

  app.register(usersRoutes, { prefix: '/api/v1' });
  app.register(authRoutes, { prefix: '/api/v1' });

  await app.register(ScalarFastifyApiReference, {
    routePrefix: '/docs',
  });

  await app.ready();

  return app;
}
