"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";

export default function NewReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: "", type: "WEEKLY", content: "" });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("error", "Title required");
      return;
    }
    if (!formData.content.trim()) {
      showToast("error", "Content required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formData.title, type: formData.type, content: formData.content }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Report submitted");
        router.push("/teachers/reports");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setSaving(false); }
  };

  if (status === "loading") return <LoadingPage message="Loading..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/teachers/reports" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Reports</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Report</h1>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <FormField label="Title" name="title" required>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" required disabled={saving} placeholder="e.g. Week 5 Report" />
          </FormField>
          <FormSelect label="Type" name="type" value={formData.type} onChange={handleChange} options={[{ value: "WEEKLY", label: "Weekly" }, { value: "MONTHLY", label: "Monthly" }]} />
          <FormTextarea label="Content" name="content" value={formData.content} onChange={handleChange} rows={8} required placeholder="Report content..." />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <LoadingSpinner size="sm" /> : null} Submit
            </button>
            <Link href="/teachers/reports" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
