import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


// Routes Imports
import userRouter from "./routes/user.route.js"
import propertyRouter from "./routes/property.route.js"




// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);


export default app