import { useState } from "react";
import useAuthFetch from "./useAuthFetch";

export default function useSaving() {
    const [savingLoading, setSavingLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    const getListSaving = async (idUser: string | undefined) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-goal/list-saving-goal?idUser=${idUser}`, {
                method: "GET",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    const getDetailSaving = async (idSavingGoal: string) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-goal/inf-saving-goal?idSavingGoal=${idSavingGoal}`, {
                method: "GET",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    const getListSavingTransactions = async (idSaving: string) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-detail/list-saving-detail?idSavingGoal=${idSaving}`, {
                method: "GET",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    const createSaving = async (body: {
        savingName: string;
        targetAmount: number;
        targetDate?: string;
        description?: string;
        idUser: string;
        urlImage?: string;
    }) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-goal/create-saving-goal`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    const createSavingTransaction = async (body: {
        idSaving: string;
        amount: number;
    }) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-detail/create-saving-detail`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    const deleteSaving = async (idSavingGoal: string) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-goal/delete-saving-goal?idSavingGoal=${idSavingGoal}`, {
                method: "DELETE",
            });
            const data = await response.json();
            return data;
        }
        catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    const deleteSavingTransaction = async (idSavingDetail: string) => {
        try {
            setSavingLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/saving-detail/delete-saving-detail?idSavingDetail=${idSavingDetail}`, {
                method: "DELETE",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setSavingLoading(false);
        }
    }

    return {
        savingLoading,
        getListSaving,
        getDetailSaving,
        createSaving,
        deleteSaving,
        getListSavingTransactions,
        createSavingTransaction,
        deleteSavingTransaction,
    };
};