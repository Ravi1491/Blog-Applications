const { createLogger, transports, format } = require("winston");

const blog_logger = createLogger({
  transports: [
    new transports.File({
      filename: "Info.log",
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { blog_logger };
