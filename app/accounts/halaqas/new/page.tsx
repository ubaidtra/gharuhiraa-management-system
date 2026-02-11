"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";

export default function NewHalaqaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", studentLevel: "", teacherId: "" });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/teachers").then((r) => r.json()).then(setTeachers).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.teacherId) {
      showToast("error", "Name and teacher are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/halaqas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, studentLevel: formData.studentLevel || null, teacherId: formData.teacherId }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Halaqa created");
        router.push("/accounts/halaqas");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setSaving(false); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;

  const teacherOptions = teachers.filter((t) => t.isActive !== false).map((t) => ({ value: t.id, label: `${t.teacherId} - ${t.firstName} ${t.lastName}` }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/accounts/halaqas" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Halaqas</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Halaqa</h1>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <FormField label="Name" name="name" required>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" required disabled={saving} placeholder="e.g. Halaqa A" />
          </FormField>
          <FormField label="Student Level" name="studentLevel">
            <input type="text" name="studentLevel" value={formData.studentLevel} onChange={handleChange} className="input-field" disabled={saving} placeholder="e.g. Level 1" />
          </FormField>
          <FormSelect label="Teacher" name="teacherId" value={formData.teacherId} onChange={handleChange} options={[{ value: "", label: "Select teacher" }, ...teacherOptions]} required />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <LoadingSpinner size="sm" /> : null} Create
            </button>
            <Link href="/accounts/halaqas" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
