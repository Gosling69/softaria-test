import { Request, Response } from "express";
import {
    DatabaseToSend,
    CollectionToSend,
    DataCollectionNames,
    InsertPagesRequest,
    DataToSend,
} from "../data/types";
import { gatherPageInfo } from "../api/index";
import { database } from "../data/db";

const express = require("express");
const pagesApi = express.Router();

pagesApi.get(
    "/get_pages",
    (request: Request, response: Response<DatabaseToSend>) => {
        //remove HTMLText property before send to client
        const responseWithoutHTML = {
            [DataCollectionNames.CurrentSites]: {} as CollectionToSend,
            [DataCollectionNames.PreviousSites]: {} as CollectionToSend,
        } as DatabaseToSend;

        responseWithoutHTML.CurrentSites = Object.fromEntries(
            Object.entries(database.CurrentSites).map(
                ([url, entryWithHTML]) => {
                    return [
                        url,
                        Object.fromEntries(
                            Object.entries(entryWithHTML).filter(
                                ([key, _]) => key !== "HTMLText",
                            ),
                        ) as DataToSend,
                    ];
                },
            ),
        );
        responseWithoutHTML.PreviousSites = Object.fromEntries(
            Object.entries(database.PreviousSites).map(
                ([url, entryWithHTML]) => {
                    return [
                        url,
                        Object.fromEntries(
                            Object.entries(entryWithHTML).filter(
                                ([key, _]) => key !== "HTMLText",
                            ),
                        ) as DataToSend,
                    ];
                },
            ),
        );
        response.send(responseWithoutHTML);
    },
);

pagesApi.put(
    "/insert_pages",
    (
        request: Request<{}, {}, InsertPagesRequest>,
        response: Response<string[] | string>,
    ) => {
        if (!request.body?.collectionName) {
            response.send("wrong collection name");
            return;
        }
        console.log(request.body);
        gatherPageInfo(request.body.links).then((results) => {
            database[request.body.collectionName] = {
                ...database[request.body.collectionName],
                ...results.success,
            };
            response.send(results.failed);
        });
    },
);
module.exports = pagesApi;
