import express from "express";
import route from "./routes/index.route";
import cors from "cors";
import "dotenv/config";
const app = express();
// const port = 5000;
const port = 8080;

app.use(express.json());
app.use("/public", express.static("public"));
app.use(cors())

console.log(process.env.DATABASE_URL);

app.use("/api", route);

app.use('/', (req, res) => {
    res.send("Hello world! from express...")
});


app.listen(port, () => console.log(`Server running on port: ${port}`));