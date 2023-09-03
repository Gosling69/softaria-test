import express from "express";
import path from "path";
import cors from "cors";
import { fillDb } from "./data/db";
import * as swaggerDocument from "../src/swagger/openapi.json";
const localPages = require("./routes/localPages");
const linksAPI = require("./routes/links");
const swaggerUi = require("swagger-ui-express");

const port = 5000;
const app = express();

app.set("views", path.join(__dirname, "../public/templates"));
app.set("view engine", "pug");

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/template", localPages);
app.use("/api", linksAPI);
app.use("/static/:num?", (req, res, next) => {
    const page = req.params.num ?? 1;
    req.url = `staticpage${page}.html`;
    express.static(path.join(__dirname, "../public/staticPages"))(
        req,
        res,
        next,
    );
});
app.listen(port, () => console.log(`Running on port ${port}`));

fillDb().then(() => {
    console.log("data aquired");
});