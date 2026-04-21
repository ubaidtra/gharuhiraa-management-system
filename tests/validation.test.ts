import {
  validateAmount,
  validateBootstrapRole,
  validatePassword,
  validateTeacherLink,
  validateUsername,
} from "@/lib/utils/validation";

describe("validation helpers", () => {
  it("accepts valid usernames", () => {
    expect(validateUsername("accounts_admin")).toEqual({ valid: true });
  });

  it("rejects short usernames", () => {
    expect(validateUsername("ab")).toEqual({
      valid: false,
      error: "Username must be at least 3 characters",
    });
  });

  it("rejects invalid teacher account linkage", () => {
    expect(validateTeacherLink("TEACHER", null)).toEqual({
      valid: false,
      error: "Teacher accounts must be linked to a teacher profile",
    });
    expect(validateTeacherLink("MANAGEMENT", "teacher-1")).toEqual({
      valid: false,
      error: "Only teacher accounts can be linked to a teacher profile",
    });
  });

  it("restricts the first bootstrap account to accounts admin", () => {
    expect(validateBootstrapRole("ACCOUNTS")).toEqual({ valid: true });
    expect(validateBootstrapRole("TEACHER")).toEqual({
      valid: false,
      error: "The first account must be an Accounts admin user",
    });
  });

  it("validates passwords and amounts", () => {
    expect(validatePassword("123456")).toEqual({ valid: true });
    expect(validateAmount("15.50")).toEqual({ valid: true });
    expect(validateAmount(0)).toEqual({
      valid: false,
      error: "Amount must be greater than 0",
    });
  });
});
