export interface SavingFormData {
  savingName: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
  urlImage?: string;
}

export interface SavingCreateData extends SavingFormData {
  idUser: string;
}
