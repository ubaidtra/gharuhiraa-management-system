/**
 * Role Display Names
 * Maps internal role names to user-friendly display names
 */

export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "MANAGEMENT":
      return "Director";
    case "ACCOUNTS":
      return "Accounts and Admin";
    case "TEACHER":
      return "Teacher";
    default:
      return role;
  }
}

export const ROLE_DISPLAY_NAMES = {
  MANAGEMENT: "Director",
  ACCOUNTS: "Accounts and Admin",
  TEACHER: "Teacher",
} as const;

