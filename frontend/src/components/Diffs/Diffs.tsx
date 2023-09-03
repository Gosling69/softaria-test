import { useState, useEffect, useCallback } from "react";
import { CollectionToSend, DatabaseToSend } from "@models/types";
import { Tabs, Tab } from "react-bootstrap";
import { SitesList } from "@components/SitesList";
import "./Diffs.css";

type diffsProps = {
    data: DatabaseToSend;
};

export const Diffs = ({ data }: diffsProps) => {
    const [missingSites, setMissingSites] = useState<CollectionToSend>(
        {} as CollectionToSend,
    );
    const [newSites, setNewsites] = useState<CollectionToSend>(
        {} as CollectionToSend,
    );
    const [diffs, setDiffs] = useState<CollectionToSend>(
        {} as CollectionToSend,
    );

    const calculateMissing = useCallback(() => {
        const { PreviousSites, CurrentSites } = data;
        const currKeys = Object.keys(CurrentSites);
        setMissingSites(
            Object.fromEntries(
                Object.entries(PreviousSites).filter(
                    ([url]) => !currKeys.includes(url),
                ),
            ),
        );
    }, [data]);

    const calculateNew = useCallback(() => {
        const { PreviousSites, CurrentSites } = data;
        const prevKeys = Object.keys(PreviousSites);
        setNewsites(
            Object.fromEntries(
                Object.entries(CurrentSites).filter(
                    ([url]) => !prevKeys.includes(url),
                ),
            ),
        );
    }, [data]);

    const calculateChanged = useCallback(() => {
        const { CurrentSites, PreviousSites } = data;
        const prevKeys = Object.keys(PreviousSites);
        const currKeys = Object.keys(CurrentSites);
        const commonKeys = currKeys.filter((url) => prevKeys.includes(url));
        const changed: string[] = [];
        for (let i = 0; i < commonKeys.length; i++) {
            const key = commonKeys[i];
            if (
                CurrentSites[key].lastModified &&
                PreviousSites[key].lastModified &&
                CurrentSites[key].lastModified ===
                    PreviousSites[key].lastModified
            ) {
                continue;
            }
            if (CurrentSites[key].hash === PreviousSites[key].hash) {
                continue;
            }
            if (
                CurrentSites[key].eTag &&
                PreviousSites[key].eTag &&
                CurrentSites[key].eTag === PreviousSites[key].eTag
            ) {
                continue;
            }
            changed.push(key);
        }
        setDiffs(
            Object.fromEntries(
                Object.entries(CurrentSites).filter(([url]) =>
                    changed.includes(url),
                ),
            ),
        );
    }, [data]);
    useEffect(() => {
        calculateMissing();
        calculateNew();
        calculateChanged();
    }, [calculateMissing, calculateNew, calculateChanged]);

    return (
        <Tabs defaultActiveKey="missingSites" className="diffsTab mb-3" justify>
            <Tab eventKey="missingSites" title="Missing Sites">
                <SitesList sites={missingSites} />
            </Tab>
            <Tab eventKey="newSites" title="New Sites">
                <SitesList sites={newSites} />
            </Tab>
            <Tab eventKey="diffs" title="Diffs">
                <SitesList sites={diffs} />
            </Tab>
        </Tabs>
    );
};
