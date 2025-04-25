const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function parseRoutes(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.ES2015,
    true
  );

  const routes = [];

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      ts.isIdentifier(node.expression.name)
    ) {
      const method = node.expression.name.text;
      const routePath = node.arguments[0]?.text;

      if (method && routePath) {
        routes.push({ method, path: routePath });
      }
    }
    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sourceFile, visit);
  return routes;
}

function generateSwaggerJson(routes, outputPath) {
  const swaggerTemplate = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
    },
    paths: {},
  };

  routes.forEach(({ method, path }) => {
    const fullPath = `/api/v1${path}`;
    if (!swaggerTemplate.paths[fullPath]) {
      swaggerTemplate.paths[fullPath] = {};
    }

    swaggerTemplate.paths[fullPath][method] = {
      summary: `Endpoint for ${method.toUpperCase()} ${path}`,
      responses: {
        200: {
          description: "Success",
        },
      },
    };
  });

  fs.writeFileSync(outputPath, JSON.stringify(swaggerTemplate, null, 2));
}

const routesFilePath = path.join(
  __dirname,
  "src",
  "API",
  "routes",
  "user.routes.ts"
);
const outputSwaggerPath = path.join(__dirname, "src", "API", "swagger.json");

const routes = parseRoutes(routesFilePath);
generateSwaggerJson(routes, outputSwaggerPath);

console.log("Swagger.json generated successfully!");