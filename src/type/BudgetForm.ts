export interface BudgetFormData {
  budgetName: string;
  budgetGoal: number;
  urlImage?: string;
}

export interface BudgetCreateData extends BudgetFormData {
  idUser: string;
}
