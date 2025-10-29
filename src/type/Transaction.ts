export interface Transaction {
	idTransaction: string;
	transactionName: string;
	transactionCategory: string;
	transactionType: "Chi" | "Thu";
	amount: number;
	transactionDate: string;
	createAt: string;
}

export interface ChartTransaction {
    expenseAmount: number;
    expensePercent: number;
    transactionCategory: string;
}