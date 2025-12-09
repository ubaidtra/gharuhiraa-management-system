export interface Teacher {
  id: string;
  teacherId: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  certificate?: string | null;
  dob: Date | string;
  photo?: string | null;
  address: string;
  phone?: string | null;
  hireDate: Date | string;
  employmentType: "FULL_TIME" | "PART_TIME" | "VOLUNTEER";
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  halaqas?: {
    id: string;
    name: string;
    students: Array<{ id: string }>;
  }[];
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  certificate?: string;
  dob: string;
  address: string;
  phone?: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "VOLUNTEER";
  photo?: string;
}

