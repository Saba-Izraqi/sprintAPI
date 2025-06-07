const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/API/swagger/generated-api-docs.json');

const app = express();
const port = 3001;

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Sprint API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true,
  }
}));

// Serve JSON documentation
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Swagger documentation server is running' });
});

app.listen(port, () => {
  console.log(`🚀 Swagger documentation server running at http://localhost:${port}`);
  console.log(`📖 Swagger UI available at http://localhost:${port}/api-docs`);
  console.log(`📄 JSON spec available at http://localhost:${port}/api-docs.json`);
});
