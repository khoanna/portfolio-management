import { useState } from "react";
import useAuthFetch from "./useAuthFetch";

export default function useBudget() {
    const [budgetLoading, setBudgetLoading] = useState(false);
    const { authFetch } = useAuthFetch();

    const getListBudgets = async (idUser: string | undefined) => {
        try {
            setBudgetLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/list-budget?idUser=${idUser}`, {
                method: "GET",
            });
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        } finally {
            setBudgetLoading(false);
        }
    };

    const createBudget = async (body: {
        budgetName: string;
        budgetGoal: number;
        urlImage: string;
        idUser: string;
    }) => {
        try {
            setBudgetLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/create-budget`, {
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
            setBudgetLoading(false);
        }
    };

    const deleteBudget = async (idBudget: string) => {
        try {
            setBudgetLoading(true);
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/budget/delete-transaction?idBudget=${idBudget}`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log(data);
            
            return data;
        } catch (error) {
            throw error;
        } finally {
            setBudgetLoading(false);
        }
    };
    
    return {
        budgetLoading,
        getListBudgets,
        createBudget,
        deleteBudget,
    };
}
