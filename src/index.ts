import express from "express";
import route from "./routes/index.route";
import cors from "cors";
import "dotenv/config";
const app = express();
const port = 5000;

app.use(express.json());
app.use("/public", express.static("public"));
app.use(cors());

app.use("/api", route);

app.use('/', (req, res) => {
    res.send("Hello world! ring ring ring ring!!!...")
});


app.listen(port, () => console.log(`Server running on port: ${port}`));