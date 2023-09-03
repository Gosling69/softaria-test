import { Request, Response } from "express";
const express = require("express");
const localPagesRouter = express.Router();

localPagesRouter.get("/:name?", (req: Request, res: Response) => {
    const name = req.params.name ?? "Anon";
    res.render("index", {
        title: `Hey, ${name}`,
        message: `Hello there, ${name}!`,
        datetime: new Date().toUTCString(),
    });
});

module.exports = localPagesRouter;
