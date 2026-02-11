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
import { Student } from "@/types/student";

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; student: Student | null }>({ isOpen: false, student: null });
  const [toggleDialog, setToggleDialog] = useState<{ isOpen: boolean; student: Student | null }>({ isOpen: false, student: null });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/students")
        .then((r) => r.json())
        .then(setStudents)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session]);

  const filtered = students.filter((s) =>
    `${s.studentId} ${s.firstName} ${s.fatherName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = async () => {
    if (!toggleDialog.student) return;
    const s = toggleDialog.student;
    setActionLoading(s.id);
    setToggleDialog({ isOpen: false, student: null });
    try {
      const res = await fetch(`/api/students/${s.id}/toggle-status`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        setStudents((prev) => prev.map((x) => (x.id === s.id ? { ...x, isActive: !x.isActive } : x)));
        showToast("success", "Status updated");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed to update"); }
    finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    if (!deleteDialog.student) return;
    const s = deleteDialog.student;
    setActionLoading(s.id);
    setDeleteDialog({ isOpen: false, student: null });
    try {
      const res = await fetch(`/api/students/${s.id}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setStudents((prev) => prev.filter((x) => x.id !== s.id));
        showToast("success", "Student deleted");
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed to delete"); }
    finally { setActionLoading(null); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading students..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <Link href="/accounts/students/new" className="btn-primary">Register New Student</Link>
        </div>
        <div className="card mb-6">
          <input
            type="text"
            placeholder="Search by ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Halaqa</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const halaqa = s.halaqa || s.Halaqa;
                  return (
                    <tr key={s.id}>
                      <td><span className="font-mono text-sm font-semibold text-blue-600">{s.studentId}</span></td>
                      <td>{s.firstName} {s.fatherName} {s.lastName}</td>
                      <td>{s.gender}</td>
                      <td>{new Date(s.dob).toLocaleDateString()}</td>
                      <td>{halaqa?.name || "Not assigned"}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${s.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link href={`/accounts/students/${s.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
                          <button
                            onClick={() => setToggleDialog({ isOpen: true, student: s })}
                            disabled={actionLoading === s.id}
                            className={`text-sm px-2 py-1 rounded ${s.isActive ? "text-orange-600 hover:text-orange-800" : "text-green-600 hover:text-green-800"} disabled:opacity-50`}
                          >
                            {actionLoading === s.id ? <LoadingSpinner size="sm" /> : s.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => setDeleteDialog({ isOpen: true, student: s })}
                            disabled={actionLoading === s.id}
                            className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState
              title="No students found"
              message={searchTerm ? `No match for "${searchTerm}"` : "Register your first student"}
              actionLabel={searchTerm ? undefined : "Register New Student"}
              onAction={searchTerm ? undefined : () => (window.location.href = "/accounts/students/new")}
            />
          )}
        </div>
        <ConfirmDialog
          isOpen={toggleDialog.isOpen}
          title={toggleDialog.student?.isActive ? "Deactivate Student" : "Activate Student"}
          message={`Are you sure you want to ${toggleDialog.student?.isActive ? "deactivate" : "activate"} ${toggleDialog.student?.firstName} ${toggleDialog.student?.lastName}?`}
          confirmText={toggleDialog.student?.isActive ? "Deactivate" : "Activate"}
          variant={toggleDialog.student?.isActive ? "warning" : "info"}
          onConfirm={handleToggle}
          onCancel={() => setToggleDialog({ isOpen: false, student: null })}
        />
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Student"
          message={`Permanently delete ${deleteDialog.student?.firstName} ${deleteDialog.student?.lastName}? This cannot be undone.`}
          confirmText="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialog({ isOpen: false, student: null })}
        />
      </div>
    </div>
  );
}
