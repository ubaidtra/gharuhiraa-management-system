"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";

export default function HalaqaDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const { showToast } = useToast();
  const id = params.id as string;
  const [halaqa, setHalaqa] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS" && id) {
      fetch(`/api/halaqas/${id}`).then((r) => r.json()).then(setHalaqa).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, id]);

  const handleDelete = async () => {
    setDeleteDialog(false);
    try {
      const res = await fetch(`/api/halaqas/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", "Halaqa deleted");
        window.location.href = "/accounts/halaqas";
      } else {
        const d = await res.json();
        showToast("error", d.error || "Failed");
      }
    } catch { showToast("error", "Failed"); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;
  if (!halaqa) return <div className="p-8 text-center text-gray-500">Halaqa not found</div>;

  const students = halaqa.Student || halaqa.students || [];
  const teacher = halaqa.Teacher || halaqa.teacher;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/accounts/halaqas" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Halaqas</Link>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{halaqa.name}</h1>
          <button onClick={() => setDeleteDialog(true)} className="btn-secondary text-red-600 hover:text-red-800">Delete</button>
        </div>
        <div className="card grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div><p className="text-sm text-gray-500">Level</p><p>{halaqa.studentLevel || "-"}</p></div>
          <div><p className="text-sm text-gray-500">Teacher</p><p>{teacher ? `${teacher.firstName} ${teacher.lastName}` : "-"}</p></div>
          <div><p className="text-sm text-gray-500">Students</p><p>{students.length}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><p className={halaqa.isActive !== false ? "text-green-600" : "text-red-600"}>{halaqa.isActive !== false ? "Active" : "Inactive"}</p></div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Students</h3>
          {students.length === 0 ? (
            <EmptyState title="No students" message="Assign students via their profile" />
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
                        <Link href={`/accounts/students/${s.id}`} className="text-blue-600 hover:text-blue-800 text-sm">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <ConfirmDialog isOpen={deleteDialog} title="Delete Halaqa" message="Permanently delete this halaqa? Students will be unassigned." confirmText="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteDialog(false)} />
      </div>
    </div>
  );
}
