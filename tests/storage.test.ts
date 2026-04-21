import {
  buildReceiptObjectPath,
  validateReceiptFile,
} from "@/lib/utils/receiptUpload";

describe("receipt storage helpers", () => {
  it("builds a receipt object path under the checks prefix", () => {
    const path = buildReceiptObjectPath("receipt.PNG");
    expect(path.startsWith("checks/")).toBe(true);
    expect(path.endsWith(".png")).toBe(true);
  });

  it("accepts supported image uploads", () => {
    const file = new File(["ok"], "proof.png", { type: "image/png" });
    expect(validateReceiptFile(file)).toEqual({ valid: true });
  });

  it("rejects unsupported uploads", () => {
    const file = new File(["not-image"], "proof.pdf", { type: "application/pdf" });
    expect(validateReceiptFile(file)).toEqual({
      valid: false,
      error: "Invalid file type. Use JPEG, PNG, GIF, or WebP",
    });
  });
});
