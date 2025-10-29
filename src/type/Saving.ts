export interface Saving {
	idSaving: string;
	savingName: string;
	description?: string | null;
	urlImage?: string | null;
	currentAmount: number;
	targetAmount: number;
	remainingAmount: number;
	savingProgress: number;
	status: string;
	targetDate?: string | null;
	createAt?: string;
	savingDetail?: string | null;
}