import { useState, useEffect, useCallback } from "react";

const port = 5000;

const baseUrl = `http://localhost:${port}`;

export const useFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refetch = useCallback(() => {
        const controller = new AbortController();
        try {
            setLoading(true);
            fetch(baseUrl + url, {
                signal: controller.signal,
            })
                .then((response) => response.json())
                .then((jsonData) => {
                    setData(jsonData);
                });
        } catch (e: any) {
            setError(e);
        } finally {
            setLoading(false);
        }
        return controller;
    }, [url]);

    useEffect(() => {
        const controller = refetch();
        return () => {
            controller.abort();
        };
    }, [refetch]);

    return { data, loading, error, refetch };
};
