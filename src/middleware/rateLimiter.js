const redis = require("../../utils/redis");

function customRedisRateLimiter({ secondsWindow, allowedHits }) {
  return async function (req, res, next) {
    const ip = (
      req.headers["x-forwarded-for"] || req.connection.remoteAddress
    ).slice(0, 9);
    const requests = await redis.incr(ip);
    let ttl;

    if (requests === 1) {
      await redis.expire(ip, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = await redis.ttl(ip);
    }

    if (requests > allowedHits) {
      return res.status(503).json({
        response: "API call exceed",
        ttl,
      });
    } else {
      next();
    }
  };
}

module.exports = { customRedisRateLimiter };
