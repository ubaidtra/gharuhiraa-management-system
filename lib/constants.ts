export const ROLES = {
  MANAGEMENT: "MANAGEMENT",
  ACCOUNTS: "ACCOUNTS",
  TEACHER: "TEACHER",
} as const;

export const TRANSACTION_TYPES = {
  REGISTRATION_FEE: "REGISTRATION_FEE",
  SCHOOL_FEE: "SCHOOL_FEE",
  UNIFORM_FEE: "UNIFORM_FEE",
  OTHER_FEE: "OTHER_FEE",
  WITHDRAWAL: "WITHDRAWAL",
} as const;

export const GENDERS = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

export const EMPLOYMENT_TYPES = {
  FULL_TIME: "FULL_TIME",
  PART_TIME: "PART_TIME",
  VOLUNTEER: "VOLUNTEER",
} as const;

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  REGISTRATION_FEE: "Registration Fee",
  SCHOOL_FEE: "School Fee",
  UNIFORM_FEE: "Uniform Fee",
  OTHER_FEE: "Other Fee",
  WITHDRAWAL: "Withdrawal",
};

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  VOLUNTEER: "Volunteer",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
};

export const ROLE_LABELS: Record<string, string> = {
  MANAGEMENT: "Management",
  ACCOUNTS: "Accounts & Admin",
  TEACHER: "Teacher",
};

