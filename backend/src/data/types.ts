export enum DataCollectionNames {
    PreviousSites = "PreviousSites",
    CurrentSites = "CurrentSites",
}
export type InsertPagesRequest = {
    collectionName: DataCollectionNames;
    links: string[];
};

export type InsertPagesResponse = {
    failed: string[];
    success: Collection;
};

export interface PageEntry {
    HTMLText: string;
    lastModified?: Date;
    eTag?: string;
    title: string;
    hash: string;
}

export type DataToSend = Omit<PageEntry, "HTMLText">;

export type CollectionToSend = {
    [key: string]: DataToSend;
};
export type DatabaseToSend = {
    [key in DataCollectionNames]: CollectionToSend;
};

export type Collection = {
    [key: string]: PageEntry;
};

export type DataBase = {
    [key in DataCollectionNames]: Collection;
};
