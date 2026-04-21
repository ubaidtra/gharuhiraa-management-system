export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < 3) return { valid: false, error: "Username must be at least 3 characters" };
  if (username.length > 20) return { valid: false, error: "Username must be less than 20 characters" };
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) return { valid: false, error: "Password must be at least 6 characters" };
  return { valid: true };
}

export function validateRole(role: string): { valid: boolean; error?: string } {
  if (!["MANAGEMENT", "ACCOUNTS", "TEACHER"].includes(role)) {
    return { valid: false, error: "Invalid role" };
  }

  return { valid: true };
}

export function validateTeacherLink(role: string, teacherId?: string | null): { valid: boolean; error?: string } {
  if (role === "TEACHER" && !teacherId) {
    return { valid: false, error: "Teacher accounts must be linked to a teacher profile" };
  }

  if (role !== "TEACHER" && teacherId) {
    return { valid: false, error: "Only teacher accounts can be linked to a teacher profile" };
  }

  return { valid: true };
}

export function validateRequired(value: string | null | undefined, field: string): { valid: boolean; error?: string } {
  if (!value?.trim()) return { valid: false, error: `${field} is required` };
  return { valid: true };
}

export function validateAmount(amount: number | string): { valid: boolean; error?: string } {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(n)) return { valid: false, error: "Amount must be a valid number" };
  if (n <= 0) return { valid: false, error: "Amount must be greater than 0" };
  return { valid: true };
}

export function validateBootstrapRole(role: string): { valid: boolean; error?: string } {
  if (role !== "ACCOUNTS") {
    return { valid: false, error: "The first account must be an Accounts admin user" };
  }

  return { valid: true };
}
