import express from "express"
import jobRoutes from "./routes/job.js"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./swagger.js"
const app=express();
app.use(express.json());
app.use("/api/job",jobRoutes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
