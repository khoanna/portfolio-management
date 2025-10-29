export interface Budget {
	idBudget: string;
	budgetName: string;
	budgetGoal: number;
	currentBudget: number;
	budgetProgress: number;
	urlImage?: string | null;
}