const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    windowMs: 12*60*60*1000,
    max: 10,
    message: 'You have exceeded the 10 requests in 12 hrs limit!',
    headers: true
})

module.exports = rateLimiter