import express from 'express'
import dotenv from 'dotenv'
import routes from './route.js'
import cors from 'cors'
import {v2 as cloundinary} from 'cloudinary'
import { startSendMailConsumer } from './consumer.js'
dotenv.config();

startSendMailConsumer();

const requireEnv = (name: string): string => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }

    return value;
};

cloundinary.config({
    cloud_name: requireEnv("CLOUD_NAME"),
    api_key: requireEnv("API_KEY"),
    api_secret: requireEnv("API_SECRET"),
});

const app=express();
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use("/api/utils",routes);


app.listen(process.env.PORT,()=>{
    console.log(`Utils Server is running on http://localhost:${process.env.PORT}`)
})