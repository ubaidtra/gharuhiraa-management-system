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

export default function NewLearningRecordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    weekStartDate: "",
    attendance: "0",
    surah: "",
    dailyDars: "",
    memorizedDays: "0",
    notMemorizedDays: "0",
    rubuAmount: "0",
    murajaaFrom: "",
    murajaaTo: "",
    murajaaDays: "0",
    murajaaNotDays: "0",
    notes: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "TEACHER") {
      fetch("/api/halaqas").then((r) => r.json()).then((halaqas) => {
        const seen = new Set<string>();
        const allStudents: any[] = [];
        (halaqas || []).forEach((h: any) => {
          const s = h.Student || h.students || [];
          s.forEach((st: any) => { if (st?.id && !seen.has(st.id)) { seen.add(st.id); allStudents.push(st); } });
        });
        setStudents(allStudents);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) {
      showToast("error", "Select a student");
      return;
    }
    const weekStart = formData.weekStartDate || (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d.toISOString().slice(0, 10); })();
    setSaving(true);
    try {
      const payload = {
        studentId: formData.studentId,
        weekStartDate: weekStart,
        attendance: parseInt(formData.attendance) || 0,
        surah: formData.surah || null,
        dailyDars: formData.dailyDars || null,
        memorizedDays: parseInt(formData.memorizedDays) || 0,
        notMemorizedDays: parseInt(formData.notMemorizedDays) || 0,
        rubuAmount: parseFloat(formData.rubuAmount) || 0,
        murajaaFrom: formData.murajaaFrom || null,
        murajaaTo: formData.murajaaTo || null,
        murajaaDays: parseInt(formData.murajaaDays) || 0,
        murajaaNotDays: parseInt(formData.murajaaNotDays) || 0,
        notes: formData.notes || null,
      };
      const res = await fetch("/api/learning-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Record added");
        router.push("/teachers/learning-records");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setSaving(false); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;

  const studentOptions = students.map((s) => ({ value: s.id, label: `${s.studentId} - ${s.firstName} ${s.lastName}` }));
  const defaultWeek = (() => { const d = new Date(); d.setDate(d.getDate() - d.getDay() + 1); return d.toISOString().slice(0, 10); })();
  const weekValue = formData.weekStartDate || defaultWeek;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/teachers/learning-records" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Records</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Learning Record</h1>
        <form onSubmit={handleSubmit} className="card space-y-6">
          <FormSelect label="Student" name="studentId" value={formData.studentId} onChange={handleChange} options={[{ value: "", label: "Select student" }, ...studentOptions]} required />
          <FormField label="Week Start Date" name="weekStartDate" required>
            <input type="date" name="weekStartDate" value={weekValue} onChange={handleChange} className="input-field" required disabled={saving} />
          </FormField>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FormField label="Attendance" name="attendance">
              <input type="number" name="attendance" value={formData.attendance} onChange={handleChange} className="input-field" min="0" disabled={saving} />
            </FormField>
            <FormField label="Memorized Days" name="memorizedDays">
              <input type="number" name="memorizedDays" value={formData.memorizedDays} onChange={handleChange} className="input-field" min="0" disabled={saving} />
            </FormField>
            <FormField label="Not Memorized Days" name="notMemorizedDays">
              <input type="number" name="notMemorizedDays" value={formData.notMemorizedDays} onChange={handleChange} className="input-field" min="0" disabled={saving} />
            </FormField>
            <FormField label="Rubu Amount" name="rubuAmount">
              <input type="number" name="rubuAmount" value={formData.rubuAmount} onChange={handleChange} className="input-field" step="0.01" min="0" disabled={saving} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Surah" name="surah"><input type="text" name="surah" value={formData.surah} onChange={handleChange} className="input-field" disabled={saving} /></FormField>
            <FormField label="Daily Dars" name="dailyDars"><input type="text" name="dailyDars" value={formData.dailyDars} onChange={handleChange} className="input-field" disabled={saving} /></FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Murajaa From" name="murajaaFrom"><input type="text" name="murajaaFrom" value={formData.murajaaFrom} onChange={handleChange} className="input-field" disabled={saving} /></FormField>
            <FormField label="Murajaa To" name="murajaaTo"><input type="text" name="murajaaTo" value={formData.murajaaTo} onChange={handleChange} className="input-field" disabled={saving} /></FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Murajaa Days" name="murajaaDays"><input type="number" name="murajaaDays" value={formData.murajaaDays} onChange={handleChange} className="input-field" min="0" disabled={saving} /></FormField>
            <FormField label="Murajaa Not Days" name="murajaaNotDays"><input type="number" name="murajaaNotDays" value={formData.murajaaNotDays} onChange={handleChange} className="input-field" min="0" disabled={saving} /></FormField>
          </div>
          <FormTextarea label="Notes" name="notes" value={formData.notes} onChange={handleChange} rows={3} />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <LoadingSpinner size="sm" /> : null} Save
            </button>
            <Link href="/teachers/learning-records" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
