import { useState } from "react";
import useAuthFetch from "./useAuthFetch";

export default function useAI() {
    const [aiLoading, setAiLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    const getHistoryChat = async (idUser: string) => {
        try {
            setAiLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/Ai-Chatting/get-history?idUser=${idUser}`, {
                method: 'GET',
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching chat history:", error);
            throw error;
        } finally {
            setAiLoading(false);
        }
    }

    const generateMessage = async ({ body }: { body: { idUser: string; userMessage: string; } }) => {
        try {
            setAiLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/Ai-Chatting/generate-message`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error generating message:", error);
            throw error;
        } finally {
            setAiLoading(false);
        }
    };

    return {
        aiLoading,
        getHistoryChat,
        generateMessage,
    };
};