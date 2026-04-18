const router  = require('express').Router();


const authRoutes = require('./auth-routes');
const logRoutes =  require('./logs-routes');

router.use('/generate-key',authRoutes);
router.use('/log',logRoutes);

module.exports = {
    router
}