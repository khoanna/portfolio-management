export interface TransactionFormData {
  transactionName: string;
  transactionCategory: string;
  transactionType: "Chi" | "Thu";
  amount: number;
  transactionDate: string;
}

export interface TransactionCreateData extends TransactionFormData {
  idUser: string;
}

export interface TransactionUpdateData extends TransactionFormData {
  idUser: string;
}
