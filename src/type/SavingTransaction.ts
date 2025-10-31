export interface SavingTransaction {
  idDetail: string;
  amount: number;
  createdAt: string;
  idSavingGoal: string;
}

export interface SavingTransactionFormData {
  amount: number;
}

export interface SavingTransactionCreateData extends SavingTransactionFormData {
  idSaving: string;
}
