export type Role = "MANAGEMENT" | "ACCOUNTS" | "TEACHER";

export const permissions = {
  MANAGEMENT: {
    canViewStudents: true,
    canEditStudents: false,
    canViewTeachers: true,
    canEditTeachers: false,
    canViewTransactions: true,
    canEditTransactions: false,
    canViewLearningRecords: true,
    canEditLearningRecords: false,
    canViewHalaqas: true,
    canEditHalaqas: false,
    canViewStatistics: true,
  },
  ACCOUNTS: {
    canViewStudents: true,
    canEditStudents: true,
    canViewTeachers: true,
    canEditTeachers: true,
    canViewTransactions: true,
    canEditTransactions: true,
    canViewLearningRecords: false,
    canEditLearningRecords: false,
    canViewHalaqas: true,
    canEditHalaqas: true,
    canViewStatistics: false,
  },
  TEACHER: {
    canViewStudents: true,
    canEditStudents: false,
    canViewTeachers: false,
    canEditTeachers: false,
    canViewTransactions: false,
    canEditTransactions: false,
    canViewLearningRecords: true,
    canEditLearningRecords: true,
    canViewHalaqas: true,
    canEditHalaqas: false,
    canViewStatistics: false,
  },
};

export function hasPermission(role: Role, permission: keyof typeof permissions.MANAGEMENT): boolean {
  return permissions[role][permission] || false;
}

