"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import FormSelect from "@/components/FormSelect";
import { useToast } from "@/components/Toast";

export default function TeacherHalaqaDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const { showToast } = useToast();
  const id = params.id as string;
  const [halaqa, setHalaqa] = useState<any>(null);
  const [unassignedStudents, setUnassignedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [addStudentId, setAddStudentId] = useState("");
  const [removeDialog, setRemoveDialog] = useState<{ isOpen: boolean; student: any }>({ isOpen: false, student: null });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  const load = useCallback(() => {
    if (session?.user.role === "TEACHER" && id) {
      Promise.all([
        fetch(`/api/halaqas/${id}`).then((r) => r.json()),
        fetch("/api/students?unassigned=1").then((r) => r.json()),
      ]).then(([halaqaData, unassigned]) => {
        setHalaqa(halaqaData);
        setUnassignedStudents(unassigned || []);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id, session]);

  useEffect(() => {
    load();
  }, [load]);

  const students = halaqa?.Student || halaqa?.students || [];

  const handleAdd = async () => {
    if (!addStudentId) return;
    setActionLoading("add");
    try {
      const res = await fetch(`/api/halaqas/${id}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: addStudentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddStudentId("");
        load();
        showToast("success", "Student added");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setActionLoading(null); }
  };

  const handleRemove = async () => {
    if (!removeDialog.student) return;
    const sid = removeDialog.student.id;
    setRemoveDialog({ isOpen: false, student: null });
    setActionLoading(sid);
    try {
      const res = await fetch(`/api/halaqas/${id}/students?studentId=${sid}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        load();
        showToast("success", "Student removed");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setActionLoading(null); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading halaqa..." />;
  if (!halaqa) return <div className="p-8 text-center text-gray-500">Halaqa not found</div>;

  const studentOptions = unassignedStudents.map((s) => ({ value: s.id, label: `${s.studentId} - ${s.firstName} ${s.lastName}` }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/teachers/halaqa" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Halaqas</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{halaqa.name}</h1>

        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Student</h3>
          <div className="flex gap-2 flex-wrap items-end">
            <div className="flex-1 min-w-[200px]">
              <FormSelect
                label="Unassigned Student"
                name="addStudentId"
                value={addStudentId}
                onChange={(e) => setAddStudentId(e.target.value)}
                options={[{ value: "", label: "Select student" }, ...studentOptions]}
              />
            </div>
            <button onClick={handleAdd} disabled={!addStudentId || actionLoading === "add"} className="btn-primary flex items-center gap-2">
              {actionLoading === "add" ? <LoadingSpinner size="sm" /> : null} Add
            </button>
          </div>
          {unassignedStudents.length === 0 && <p className="text-sm text-gray-500 mt-2">No unassigned students</p>}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Students ({students.length})</h3>
          {students.length === 0 ? (
            <EmptyState title="No students" message="Add students using the form above" />
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s: any) => (
                    <tr key={s.id}>
                      <td className="font-mono text-sm">{s.studentId}</td>
                      <td>{s.firstName} {s.lastName}</td>
                      <td>
                        <button onClick={() => setRemoveDialog({ isOpen: true, student: s })} disabled={actionLoading === s.id} className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50">
                          {actionLoading === s.id ? <LoadingSpinner size="sm" /> : "Remove"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ConfirmDialog isOpen={removeDialog.isOpen} title="Remove Student" message={`Remove ${removeDialog.student?.firstName} ${removeDialog.student?.lastName} from this halaqa?`} confirmText="Remove" variant="danger" onConfirm={handleRemove} onCancel={() => setRemoveDialog({ isOpen: false, student: null })} />
      </div>
    </div>
  );
}
