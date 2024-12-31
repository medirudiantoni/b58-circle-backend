"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const app = (0, express_1.default)();
// const port = 5000;
const port = 8080;
app.use(express_1.default.json());
app.use("/public", express_1.default.static("public"));
app.use((0, cors_1.default)());
console.log(process.env.DATABASE_URL);
app.use("/api", index_route_1.default);
app.use('/', (req, res) => {
    res.send("Hello world! from express...!!");
});
app.listen(port, () => console.log(`Server running on port: ${port}`));
