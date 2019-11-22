require('dotenv').config();
import express from "express";
import path from "path";
import routes from "./routes/index";
import cors from "cors";

const app = express();

//settings
app.set("port", process.env.PORT || 4000);
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.resolve("uploads")));

//routes
app.use("/api", routes);

export default app;