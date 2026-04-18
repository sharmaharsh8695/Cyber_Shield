const router  = require('express').Router();

const {getLogs} = require('../services/logs-service');

router.get('/',(req,res)=>{
    res.json(getLogs());
})