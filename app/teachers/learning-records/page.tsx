"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";

export default function LearningRecordsPage() {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentFilter, setStudentFilter] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "TEACHER") {
      const url = studentFilter ? `/api/learning-records?studentId=${studentFilter}` : "/api/learning-records";
      fetch(url).then((r) => r.json()).then(setRecords).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, studentFilter]);

  if (loading || status === "loading") return <LoadingPage message="Loading records..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Records</h1>
          <Link href="/teachers/learning-records/new" className="btn-primary">Add Record</Link>
        </div>
        <div className="card">
          <div className="table-container overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Student</th>
                  <th>Attendance</th>
                  <th>Memorized</th>
                  <th>Not Mem</th>
                  <th>Rubu</th>
                  <th>Murajaa</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const s = r.Student || r.student;
                  return (
                    <tr key={r.id}>
                      <td>{new Date(r.weekStartDate).toLocaleDateString()}</td>
                      <td>{s ? `${s.studentId} ${s.firstName} ${s.lastName}` : "-"}</td>
                      <td>{r.attendance ?? 0}</td>
                      <td>{r.memorizedDays ?? 0}</td>
                      <td>{r.notMemorizedDays ?? 0}</td>
                      <td>{r.rubuAmount ?? 0}</td>
                      <td>{r.murajaaFrom && r.murajaaTo ? `${r.murajaaFrom}-${r.murajaaTo}` : "-"}</td>
                      <td className="max-w-[150px] truncate">{r.notes || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {records.length === 0 && (
            <EmptyState title="No learning records" message="Add your first record" actionLabel="Add Record" onAction={() => (window.location.href = "/teachers/learning-records/new")} />
          )}
        </div>
      </div>
    </div>
  );
}
