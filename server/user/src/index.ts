import express from "express"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import userRoutes from "./routes/user.js"
import swaggerSpec from "./swagger.js"
import cors from "cors"

dotenv.config();

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
       throw new Error("PORT must be a valid integer between 1 and 65535");
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
       console.log(`User Service running on http://localhost:${port}`);
});