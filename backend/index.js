const express = require("express");
const cors = require('cors')
const rootRouter = require('./routes/index.js')



const app = express();
app.use(cors({
    origin: "https://payment-xi-five.vercel.app", // Your frontend URL
    credentials: true,
  }))
app.use(express.json())



app.use('/api/v1',rootRouter)


app.get("/", (req, res) => {
    res.send("Server is running 🚀"); // Check if this works
  });





app.listen(3000,(req,res)=>{
console.log("listening on port 3000")
});

