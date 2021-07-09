const express = require("express");
const app = express();

const port = 3000;

app.use(express.json())
 
const sales = require('./sales.js')
app.use('/sales', sales)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});