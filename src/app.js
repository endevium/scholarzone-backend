import express from "express";
import cors from "cors";


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send("Welcome to ScholarZone!");
});

export default app;