const express   = require('express');
const mongoose  = require('mongoose');
const app       = express();

require('dotenv').config();

app.get('/',(req, res) => {
    res.send('hello from node');
})

mongoose.connect(process.env.DATABASE,{}).then(()=>{
    console.log('db connected');
}).catch((error)=>{
     console.log('error')
     console.log(error)
})

const port = process.env.PORT || 8000

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})