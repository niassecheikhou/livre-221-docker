import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API LIVRE 221',
      version: '1.0.0',
      description: 'Documentation API de la librairie en ligne'
    },
    servers: [
      {
        url: 'http://localhost:5000'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/config/swagger-annotation.js']
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
