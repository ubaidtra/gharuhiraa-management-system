"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "TEACHER") {
      fetch("/api/reports").then((r) => r.json()).then(setReports).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading reports..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <Link href="/teachers/reports/new" className="btn-primary">New Report</Link>
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="font-medium">{r.title}</td>
                    <td><span className="px-2 py-1 rounded text-xs bg-gray-100">{r.type}</span></td>
                    <td><Link href={`/teachers/reports/${r.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reports.length === 0 && (
            <EmptyState title="No reports" message="Submit your first report" actionLabel="New Report" onAction={() => (window.location.href = "/teachers/reports/new")} />
          )}
        </div>
      </div>
    </div>
  );
}
