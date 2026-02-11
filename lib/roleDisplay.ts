export function getRoleDisplayName(role: string): string {
  switch (role) {
    case "MANAGEMENT": return "Director";
    case "ACCOUNTS": return "Accounts and Admin";
    case "TEACHER": return "Teacher";
    default: return role;
  }
}
