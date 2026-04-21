"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";

const FEE_TYPES = ["REGISTRATION_FEE", "SCHOOL_FEE", "UNIFORM_FEE", "OTHER_FEE"];

function NewTransactionForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedStudentId = searchParams.get("studentId");
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    type: "SCHOOL_FEE",
    amount: "",
    description: "",
    paidForMonth: new Date().toISOString().slice(0, 7),
    date: new Date().toISOString().slice(0, 10),
    studentId: preselectedStudentId || "",
    photoUrl: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/students").then((r) => r.json()).then(setStudents).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  useEffect(() => {
    if (preselectedStudentId) setFormData((f) => ({ ...f, studentId: preselectedStudentId }));
  }, [preselectedStudentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((current) => {
      if (name === "type") {
        return {
          ...current,
          type: value,
          paidForMonth: value === "SCHOOL_FEE" ? current.paidForMonth || new Date().toISOString().slice(0, 7) : "",
        };
      }

      return { ...current, [name]: value };
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok && data.url) setFormData((f) => ({ ...f, photoUrl: data.url }));
      else showToast("error", data.error || "Upload failed");
    } catch { showToast("error", "Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showToast("error", "Enter a valid amount");
      return;
    }
    if (formData.type !== "WITHDRAWAL" && !formData.studentId) {
      showToast("error", "Select a student for fee payment");
      return;
    }
    if (formData.type === "SCHOOL_FEE" && !formData.paidForMonth) {
      showToast("error", "Select the month this school fee covers");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        type: formData.type,
        amount,
        description: formData.description || null,
        paidForMonth: formData.type === "SCHOOL_FEE" ? formData.paidForMonth : null,
        date: formData.date,
        studentId: formData.type === "WITHDRAWAL" ? null : formData.studentId || null,
        photoUrl: formData.photoUrl || null,
      };
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Payment recorded");
        router.push("/accounts/transactions");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setSaving(false); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;

  const typeOptions = FEE_TYPES.map((k) => ({ value: k, label: TRANSACTION_TYPE_LABELS[k] }));
  const studentOptions = students.filter((s) => s.isActive !== false).map((s) => ({ value: s.id, label: `${s.studentId} - ${s.firstName} ${s.lastName}` }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/accounts/transactions" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Payments</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Record Payment</h1>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <FormSelect label="Type" name="type" value={formData.type} onChange={handleChange} options={typeOptions} />
          <FormField label="Amount (GMD)" name="amount" required>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field" step="0.01" min="0" required disabled={saving} />
          </FormField>
          <FormField label="Date" name="date" required>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required disabled={saving} />
          </FormField>
          {formData.type === "SCHOOL_FEE" && (
            <FormField label="School Fee Month" name="paidForMonth" required hint="Select the month this payment covers.">
              <input
                type="month"
                name="paidForMonth"
                value={formData.paidForMonth}
                onChange={handleChange}
                className="input-field"
                required
                disabled={saving}
              />
            </FormField>
          )}
          <FormSelect label="Student" name="studentId" value={formData.studentId} onChange={handleChange} options={[{ value: "", label: "Select student" }, ...studentOptions]} required />
          <FormTextarea label="Description" name="description" value={formData.description} onChange={handleChange} rows={2} />
          <FormField label="Receipt Photo (optional)" name="photoUrl">
            <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={uploading || saving} className="input-field" />
            {formData.photoUrl && <p className="text-sm text-green-600 mt-1">Uploaded. <button type="button" onClick={() => setFormData((f) => ({ ...f, photoUrl: "" }))} className="text-red-600">Remove</button></p>}
          </FormField>
          <div className="flex gap-2">
            <button type="submit" disabled={saving || uploading} className="btn-primary flex items-center gap-2">
              {saving || uploading ? <LoadingSpinner size="sm" /> : null} {uploading ? "Uploading..." : "Record"}
            </button>
            <Link href="/accounts/transactions" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewTransactionPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading..." />}>
      <NewTransactionForm />
    </Suspense>
  );
}
