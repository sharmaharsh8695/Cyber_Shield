const router  = require('express').Router();

const authRoutes = require('./auth-routes');
const logRoutes =  require('./logs-routes');
const { authMiddleware } = require('../middleware/auth-middleware');
const { idsMiddleware } = require('../middleware/ids-middleware');
const { rateLimiter } = require('../middleware/rateLimiter');
const { forwardRequest } = require("../services/proxy-service");

router.use('/auth', authRoutes);
router.use('/logs', authMiddleware, logRoutes);


router.use(
  "/protect",
  authMiddleware,
  rateLimiter,
  idsMiddleware,
  async (req, res) => {
    const result = await forwardRequest(req);

    return res.status(result.status).json(result.data);
  }
);


module.exports = router;