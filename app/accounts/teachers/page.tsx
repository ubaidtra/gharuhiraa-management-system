"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/Toast";

export default function TeachersPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; teacher: any }>({ isOpen: false, teacher: null });
  const [toggleDialog, setToggleDialog] = useState<{ isOpen: boolean; teacher: any }>({ isOpen: false, teacher: null });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/teachers").then((r) => r.json()).then(setTeachers).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  const filtered = teachers.filter((t) =>
    `${t.teacherId} ${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const halaqaCount = (t: any) => (t.halaqas || t.Halaqa || []).length;
  const studentCount = (t: any) => (t.halaqas || t.Halaqa || []).reduce((s: number, h: any) => s + (h.students?.length || h.Student?.length || 0), 0);

  const handleToggle = async () => {
    if (!toggleDialog.teacher) return;
    const t = toggleDialog.teacher;
    setActionLoading(t.id);
    setToggleDialog({ isOpen: false, teacher: null });
    try {
      const res = await fetch(`/api/teachers/${t.id}/toggle-status`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setTeachers((prev) => prev.map((x) => (x.id === t.id ? { ...x, isActive: !x.isActive } : x)));
        showToast("success", "Status updated");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    if (!deleteDialog.teacher) return;
    const t = deleteDialog.teacher;
    setActionLoading(t.id);
    setDeleteDialog({ isOpen: false, teacher: null });
    try {
      const res = await fetch(`/api/teachers/${t.id}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setTeachers((prev) => prev.filter((x) => x.id !== t.id));
        showToast("success", "Teacher deleted");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setActionLoading(null); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading teachers..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <Link href="/accounts/teachers/new" className="btn-primary">Add New Teacher</Link>
        </div>
        <div className="card mb-6">
          <input type="text" placeholder="Search by ID or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field" />
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Employment</th>
                  <th>Halaqas</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td><span className="font-mono text-sm font-semibold text-green-600">{t.teacherId}</span></td>
                    <td>{t.firstName} {t.lastName}</td>
                    <td>{t.gender}</td>
                    <td>{t.employmentType?.replace(/_/g, " ") || "-"}</td>
                    <td>{halaqaCount(t)}</td>
                    <td>{studentCount(t)}</td>
                    <td><span className={`px-2 py-1 rounded text-xs ${t.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{t.isActive ? "Active" : "Inactive"}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/accounts/teachers/${t.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
                        <button onClick={() => setToggleDialog({ isOpen: true, teacher: t })} disabled={actionLoading === t.id} className={`text-sm px-2 py-1 rounded ${t.isActive ? "text-orange-600" : "text-green-600"} disabled:opacity-50`}>
                          {actionLoading === t.id ? <LoadingSpinner size="sm" /> : t.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => setDeleteDialog({ isOpen: true, teacher: t })} disabled={actionLoading === t.id} className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState title="No teachers found" message={searchTerm ? `No match for "${searchTerm}"` : "Add your first teacher"} actionLabel={searchTerm ? undefined : "Add New Teacher"} onAction={searchTerm ? undefined : () => (window.location.href = "/accounts/teachers/new")} />
          )}
        </div>
        <ConfirmDialog isOpen={toggleDialog.isOpen} title={toggleDialog.teacher?.isActive ? "Deactivate Teacher" : "Activate Teacher"} message={`${toggleDialog.teacher?.isActive ? "Deactivate" : "Activate"} ${toggleDialog.teacher?.firstName} ${toggleDialog.teacher?.lastName}?`} confirmText={toggleDialog.teacher?.isActive ? "Deactivate" : "Activate"} variant={toggleDialog.teacher?.isActive ? "warning" : "info"} onConfirm={handleToggle} onCancel={() => setToggleDialog({ isOpen: false, teacher: null })} />
        <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Teacher" message={`Permanently delete ${deleteDialog.teacher?.firstName} ${deleteDialog.teacher?.lastName}?`} confirmText="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteDialog({ isOpen: false, teacher: null })} />
      </div>
    </div>
  );
}
