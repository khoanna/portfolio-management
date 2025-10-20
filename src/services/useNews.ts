import { useState } from "react";
import useAuthFetch from "./useAuthFetch";

export default function useNews() {
    const [newsLoading, setNewsLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    const getTrendingNews = async () => {
        try {
            setNewsLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/news/list-news-trending`, {
                method: "GET"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching trending news:", error);
        } finally {
            setNewsLoading(false);
        }
    };

    const getReportNews = async () => {
        try {
            setNewsLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/news/list-special-reports`, {
                method: "GET"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching report news:", error);
        } finally {
            setNewsLoading(false);
        }
    };

    const getNews = async () => {
        try {
            setNewsLoading(true);   
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/news/list-news`, {
                method: "GET"
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setNewsLoading(false);
        }
    };

    return {
        newsLoading,
        getTrendingNews,
        getReportNews,
        getNews
    };
}