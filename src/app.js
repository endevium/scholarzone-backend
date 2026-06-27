import express from "express";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.get('/', (_, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Welcome to ScholarZone!");
});

// Importing and using custom routes for the system
import reviewerRoutes from "./routes/reviewerRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

app.use("/api", reviewerRoutes);

export default app;