import { setupSwagger, specs } from '../swagger/swagger.config';
import express from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Script to generate Swagger JSON documentation
 * This can be run independently to generate static API documentation
 */

const app = express();

// Setup swagger
setupSwagger(app);

// Generate JSON file
const outputPath = path.join(__dirname, '../swagger/generated-api-docs.json');

try {
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  console.log('✅ Swagger documentation generated successfully!');
  console.log(`📄 File saved to: ${outputPath}`);
  console.log('📖 Documentation includes:');
  console.log('  - Authentication endpoints');
  console.log('  - Project management');
  console.log('  - Issue tracking');
  console.log('  - Epic management');
  console.log('  - Board columns');
  console.log('🚀 Start your server and visit /api-docs to view the interactive documentation');
} catch (error) {
  console.error('❌ Error generating Swagger documentation:', error);
  process.exit(1);
}
