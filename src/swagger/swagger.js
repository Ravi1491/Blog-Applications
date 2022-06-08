const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Blog Application",
        description: "Blog Application Rest API Information",
        contact: {
          name: "ravi",
        },
        servers: [
          {
            api: "http://localhost:3000/",
          },
        ],
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{
          bearerAuth: [],
        },
      ],
    },
    apis: ["./src/swagger/*.js"],
  };
  
  module.exports = swaggerOptions