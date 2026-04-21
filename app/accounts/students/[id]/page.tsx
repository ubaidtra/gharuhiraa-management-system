"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import { useToast } from "@/components/Toast";
import { GENDER_LABELS } from "@/lib/constants";
import { formatCurrency, formatMonthValue } from "@/lib/utils/format";

export default function StudentDetailPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<any>(null);
  const [halaqas, setHalaqas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS" && id) {
      Promise.all([fetch(`/api/students/${id}`).then((r) => r.json()), fetch("/api/halaqas").then((r) => r.json())])
        .then(([data, halaqasList]) => {
          setStudent(data);
          setHalaqas(halaqasList || []);
          setFormData({
            firstName: data.firstName,
            fatherName: data.fatherName,
            lastName: data.lastName,
            dob: data.dob?.slice?.(0, 10) || "",
            address: data.address,
            gender: data.gender,
            phone: data.phone || "",
            guardianPhone: data.guardianPhone || "",
            halaqaId: data.halaqaId || "",
            isActive: String(data.isActive),
          });
        })
        .catch(() => showToast("error", "Failed to load student"))
        .finally(() => setLoading(false));
    }
  }, [session, id, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        firstName: formData.firstName,
        fatherName: formData.fatherName,
        lastName: formData.lastName,
        dob: formData.dob,
        address: formData.address,
        gender: formData.gender,
        phone: formData.phone || null,
        guardianPhone: formData.guardianPhone || null,
        isActive: formData.isActive === "true",
        halaqaId: formData.halaqaId || null,
      };
      const res = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
        setEditing(false);
        showToast("success", "Student updated");
      } else {
        const d = await res.json();
        showToast("error", d.error || "Failed");
      }
    } catch { showToast("error", "Failed"); }
    finally { setSaving(false); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;
  if (!student) return <div className="p-8 text-center text-gray-500">Student not found</div>;

  const halaqa = student.halaqa || student.Halaqa;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/accounts/students" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">Back to Students</Link>
            <h1 className="text-3xl font-bold text-gray-900">{student.studentId} - {student.firstName} {student.lastName}</h1>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-primary">Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <LoadingSpinner size="sm" /> : null} Save
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="First Name" name="firstName" required>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required disabled={saving} />
              </FormField>
              <FormField label="Father Name" name="fatherName" required>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="input-field" required disabled={saving} />
              </FormField>
              <FormField label="Last Name" name="lastName" required>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required disabled={saving} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Date of Birth" name="dob" required>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" required disabled={saving} />
              </FormField>
              <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={Object.entries(GENDER_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
            </div>
            <FormTextarea label="Address" name="address" value={formData.address} onChange={handleChange} required rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Phone" name="phone"><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" disabled={saving} /></FormField>
              <FormField label="Guardian Phone" name="guardianPhone"><input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="input-field" disabled={saving} /></FormField>
            </div>
            <FormSelect label="Halaqa" name="halaqaId" value={formData.halaqaId} onChange={handleChange} options={[{ value: "", label: "No halaqa" }, ...halaqas.map((h) => ({ value: h.id, label: h.name }))]} />
            <FormField label="Status" name="isActive">
              <select name="isActive" value={formData.isActive} onChange={handleChange} className="input-field" disabled={saving}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </FormField>
          </div>
        ) : (
          <>
            <div className="card grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div><p className="text-sm text-gray-500">Student ID</p><p className="font-mono font-semibold">{student.studentId}</p></div>
              <div><p className="text-sm text-gray-500">Gender</p><p>{student.gender}</p></div>
              <div><p className="text-sm text-gray-500">DOB</p><p>{new Date(student.dob).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-gray-500">Halaqa</p><p>{halaqa?.name || "Not assigned"}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">Address</p><p>{student.address}</p></div>
              <div><p className="text-sm text-gray-500">Phone</p><p>{student.phone || "-"}</p></div>
              <div><p className="text-sm text-gray-500">Guardian</p><p>{student.guardianPhone || "-"}</p></div>
              <div><p className="text-sm text-gray-500">Status</p><p><span className={student.isActive ? "text-green-600" : "text-red-600"}>{student.isActive ? "Active" : "Inactive"}</span></p></div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                {(student.transactions || []).length === 0 ? <p className="text-gray-500 text-sm">No transactions</p> : (
                  <div className="space-y-2">
                    {(student.transactions || []).slice(0, 5).map((t: any) => (
                      <div key={t.id} className="flex justify-between text-sm">
                        <span>
                          {t.type}
                          {t.paidForMonth ? ` (${formatMonthValue(t.paidForMonth)})` : ""}
                          {" - "}
                          {new Date(t.date).toLocaleDateString()}
                        </span>
                        <span className="font-medium">{formatCurrency(Number(t.amount))}</span>
                      </div>
                    ))}
                    <Link href={`/accounts/transactions/new?studentId=${student.id}`} className="text-blue-600 text-sm">Add Payment</Link>
                  </div>
                )}
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Learning Records</h3>
                {(student.learningRecords || []).length === 0 ? <p className="text-gray-500 text-sm">No records</p> : (
                  <div className="space-y-2">
                    {(student.learningRecords || []).slice(0, 5).map((r: any) => (
                      <div key={r.id} className="text-sm">
                        Week {new Date(r.weekStartDate).toLocaleDateString()} - Attend: {r.attendance}, Mem: {r.memorizedDays}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
