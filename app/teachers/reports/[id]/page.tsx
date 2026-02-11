"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useToast } from "@/components/Toast";

export default function ReportDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const { showToast } = useToast();
  const id = params.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "TEACHER" && id) {
      fetch(`/api/reports/${id}`).then((r) => r.json()).then(setReport).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, id]);

  const handleDelete = async () => {
    setDeleteDialog(false);
    setDeleting(true);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Report deleted");
        window.location.href = "/teachers/reports";
      } else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setDeleting(false); }
  };

  if (loading || status === "loading") return <LoadingPage message="Loading report..." />;
  if (!report) return <div className="p-8 text-center text-gray-500">Report not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/teachers/reports" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Reports</Link>
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
            <p className="text-gray-500 mt-1">{new Date(report.createdAt).toLocaleString()} | {report.type}</p>
          </div>
          <button onClick={() => setDeleteDialog(true)} disabled={deleting} className="btn-secondary text-red-600 hover:text-red-800 flex items-center gap-2">
            {deleting ? <LoadingSpinner size="sm" /> : null} Delete
          </button>
        </div>
        <div className="card prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-700">{report.content}</pre>
        </div>
        <ConfirmDialog isOpen={deleteDialog} title="Delete Report" message="Permanently delete this report?" confirmText="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteDialog(false)} />
      </div>
    </div>
  );
}
