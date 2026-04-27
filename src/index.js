const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const router = require('./routes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',router)

// app.listen(process.env.PORT,(req,res)=>{
//     console.log("app started on port",process.env.PORT);
// })