import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cors from 'cors'

import path from 'path';


dotenv.config();
//database confid
connectDB();

//rest api
const app = express()

//static files access
app.use(path, join(__dirname, './client/build'))

//middle ware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//routers 
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", productRoutes)

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client1/build/index.html'))
})

app.get("/", (req, res) => {
    res.send(
        "<h1>Welcome to mera sarathi</h1>"
    )
})

//port
const PORT = process.env.PORT || 8000;

//run 
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white);
})
