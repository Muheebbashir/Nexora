import express from "express";
import authRoutes from './routes/auth.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from "./swagger.js";
const app=express();

app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default app;