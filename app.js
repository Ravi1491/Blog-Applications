const express = require("express");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = require("./src/swagger/swagger");
require("dotenv").config();
// require("./src/auth/passport");

const app = express();
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/", require("./src/routes/index"));

app.listen(8080, () => {
  console.log("Listening on port 8080");
});
