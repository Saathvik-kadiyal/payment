const express = require("express");
const cors = require('cors')
const rootRouter = require('./routes/index.js')

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(express.json())



app.use('/api/v1',rootRouter)


app.get("/", (req, res) => {
    res.send("Server is running 🚀"); 
  });





app.listen(PORT,(req,res)=>{
console.log(`listening on port ${PORT}`)
});

