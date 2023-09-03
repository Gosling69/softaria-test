import { InsertPagesResponse, PageEntry } from "../data/types";
import crypto from "crypto";

//function to get pagesInfo
export const gatherPageInfo = async (
    links: string[],
): Promise<InsertPagesResponse> => {
    const responseToSend = {
        success: {},
        failed: [],
    } as InsertPagesResponse;
    //make async queues for each hostname
    const queues = {} as Record<string, string[]>;
    for (let link of links) {
        try {
            const url = new URL(link);
            if (!queues[url.hostname]) {
                queues[url.hostname] = [link];
            } else {
                queues[url.hostname].push(link);
            }
        } catch {
            responseToSend.failed.push(link);
        }
    }
    //query all pages by respective queries
    const results = await Promise.allSettled(
        Object.values(queues).map((links) => {
            const groupPromise = new Promise<InsertPagesResponse>(
                async (resolve) => {
                    const groupResponse = {
                        success: {},
                        failed: [],
                    } as InsertPagesResponse;

                    for (let link of links) {
                        try {
                            const response = await fetch(link);
                            //if 404 break and push to failed
                            if (!response.ok) throw new Error();
                            const textData = await response.text();
                            const startIndex = textData.indexOf("<title>");
                            const endIndex = textData.indexOf("</title>");
                            let title = "";
                            if (startIndex !== -1 && endIndex !== -1) {
                                title = textData.slice(
                                    startIndex + 7,
                                    endIndex,
                                );
                            }
                            const pageRes = {
                                HTMLText: textData,
                                title,
                            } as PageEntry;
                            if (response.headers.has("last-modified")) {
                                pageRes.lastModified = new Date(
                                    response.headers.get("last-modified")!,
                                );
                            }
                            if (response.headers.has("etag")) {
                                pageRes.eTag = response.headers.get("eTag")!;
                            }
                            pageRes.hash = crypto
                                .createHash("md5")
                                .update(textData)
                                .digest("hex");
                            groupResponse.success[link] = pageRes;
                        } catch (e) {
                            groupResponse.failed.push(link);
                        }
                    }
                    resolve(groupResponse);
                },
            );
            return groupPromise;
        }),
    );
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            responseToSend.success = {
                ...responseToSend.success,
                ...result.value.success,
            };
            responseToSend.failed = [
                ...responseToSend.failed,
                ...result.value.failed,
            ];
        }
    });
    return new Promise((resolve) => resolve(responseToSend));
};
