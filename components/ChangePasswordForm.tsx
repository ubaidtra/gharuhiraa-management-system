"use client";

import { useState } from "react";
import FormField from "@/components/FormField";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";

export default function ChangePasswordForm() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      showToast("error", "All password fields are required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.error || "Failed to change password");
        return;
      }

      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("success", data.message || "Password changed");
    } catch {
      showToast("error", "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Current Password" name="currentPassword" required>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          className="input-field"
          autoComplete="current-password"
          disabled={saving}
          required
        />
      </FormField>
      <FormField label="New Password" name="newPassword" required hint="Use at least 6 characters.">
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          className="input-field"
          minLength={6}
          autoComplete="new-password"
          disabled={saving}
          required
        />
      </FormField>
      <FormField label="Confirm New Password" name="confirmPassword" required>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-field"
          minLength={6}
          autoComplete="new-password"
          disabled={saving}
          required
        />
      </FormField>
      <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
        {saving ? <LoadingSpinner size="sm" /> : null}
        Change Password
      </button>
    </form>
  );
}
