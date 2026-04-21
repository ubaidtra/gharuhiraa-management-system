import { formatMonthValue } from "@/lib/utils/format";

describe("formatMonthValue", () => {
  it("formats a YYYY-MM value into a readable month", () => {
    expect(formatMonthValue("2026-04")).toBe("April 2026");
  });

  it("returns the original value for invalid month strings", () => {
    expect(formatMonthValue("invalid")).toBe("invalid");
  });
});
