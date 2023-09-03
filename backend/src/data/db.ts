import { Collection, DataBase, DataCollectionNames } from "./types";
import { gatherPageInfo } from "../api";

const testLinks = [
    "https://goldapple.ru/11910-19000041617-pro-icon-look-satin-face-powder",
    "http://localhost:5000/static/1",
    "http://localhost:5000/static/2",
    "http://localhost:5000/static/3",
    "http://localhost:5000/template",
    "http://localhost:5000/template/vasya",
    "http://localhost:5000/template/kolya",
    "https://stackoverflow.com/questions/50679031/why-are-these-tsconfig-paths-not-working",
    "https://stackoverflow.com/questions/43281741/how-to-use-paths-in-tsconfig-json",
    "https://habr.com/ru/articles/536512/",
    "https://expressjs.com/en/starter/generator.html",
];

export const database = {
    [DataCollectionNames.CurrentSites]: {} as Collection,
    [DataCollectionNames.PreviousSites]: {} as Collection,
} as DataBase;

export const fillDb = async () => {
    const pageData = await gatherPageInfo(testLinks)
    database.PreviousSites = {...database.PreviousSites, ...pageData.success}
};
