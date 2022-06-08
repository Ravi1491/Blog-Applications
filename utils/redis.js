const Redis = require("redis");
const redisClient = Redis.createClient();

redisClient.on("error", (err) => {
  logger.error(err);
});

redisClient.connect();
module.exports = redisClient;
