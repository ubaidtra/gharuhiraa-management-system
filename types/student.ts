export interface Student {
  id: string;
  studentId: string;
  firstName: string;
  fatherName: string;
  lastName: string;
  dob: Date | string;
  address: string;
  gender: "MALE" | "FEMALE";
  registrationDate: Date | string;
  phone?: string | null;
  guardianPhone?: string | null;
  photo?: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  halaqaId?: string | null;
  halaqa?: {
    id: string;
    name: string;
    teacher?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  } | null;
}

export interface StudentFormData {
  firstName: string;
  fatherName: string;
  lastName: string;
  dob: string;
  address: string;
  gender: "MALE" | "FEMALE";
  phone?: string;
  guardianPhone?: string;
  photo?: string;
  halaqaId?: string;
}

