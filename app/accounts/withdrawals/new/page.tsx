"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import FormField from "@/components/FormField";
import FormTextarea from "@/components/FormTextarea";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";

export default function NewWithdrawalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showToast("error", "Enter a valid amount");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "WITHDRAWAL",
          amount,
          description: formData.description || null,
          date: formData.date,
          studentId: null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Withdrawal recorded");
        router.push("/accounts/withdrawals");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setSaving(false); }
  };

  if (status === "loading") return <LoadingPage message="Loading..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/accounts/withdrawals" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Withdrawals</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Record Withdrawal</h1>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <FormField label="Amount (GMD)" name="amount" required>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field" step="0.01" min="0" required disabled={saving} />
          </FormField>
          <FormField label="Date" name="date" required>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required disabled={saving} />
          </FormField>
          <FormTextarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Purpose of withdrawal" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <LoadingSpinner size="sm" /> : null} Record
            </button>
            <Link href="/accounts/withdrawals" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
