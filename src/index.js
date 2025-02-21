import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/index.js"


dotenv.config({
    path: './.env'
})

const port = process.env.PORT



app.get('/', (req, res) => {
    res.send("Alhamdulillah")
})




// Connecting the Database and Starting the Server
connectDB()
.then(() => {
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
}).catch((err) => {
  console.log(err);
})