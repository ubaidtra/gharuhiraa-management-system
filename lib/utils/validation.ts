export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 7;
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters long" };
  }
  if (username.length > 20) {
    return { valid: false, error: "Username must be less than 20 characters" };
  }
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters long" };
  }
  return { valid: true };
}

export function validateRequired(value: string | null | undefined, fieldName: string): { valid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

export function validateDate(date: string): { valid: boolean; error?: string } {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: "Invalid date format" };
  }
  if (dateObj > new Date()) {
    return { valid: false, error: "Date cannot be in the future" };
  }
  return { valid: true };
}

export function validateAmount(amount: number | string): { valid: boolean; error?: string } {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) {
    return { valid: false, error: "Amount must be a valid number" };
  }
  if (numAmount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }
  return { valid: true };
}

