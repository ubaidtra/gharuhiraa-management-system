export type TransactionType =
  | "REGISTRATION_FEE"
  | "SCHOOL_FEE"
  | "UNIFORM_FEE"
  | "OTHER_FEE"
  | "WITHDRAWAL";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description?: string | null;
  date: Date | string;
  photoUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  studentId?: string | null;
  student?: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
  } | null;
}

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  description?: string;
  studentId?: string;
  photoUrl?: string;
  date?: string;
}

