"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";

export default function ManagementStudentsPage() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "MANAGEMENT") {
      const url = searchTerm ? `/api/students?search=${encodeURIComponent(searchTerm)}` : "/api/students";
      fetch(url).then((r) => r.json()).then(setStudents).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, searchTerm]);

  if (loading || status === "loading") return <LoadingPage message="Loading students..." />;

  const halaqaName = (s: any) => (s.halaqa || s.Halaqa)?.name || "-";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Students</h1>
        <div className="card mb-6">
          <input type="text" placeholder="Search by ID or name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field" />
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Halaqa</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono text-sm font-semibold">{s.studentId}</td>
                    <td>{s.firstName} {s.lastName}</td>
                    <td>{s.gender}</td>
                    <td>{halaqaName(s)}</td>
                    <td><span className={`px-2 py-1 rounded text-xs ${s.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{s.isActive !== false ? "Active" : "Inactive"}</span></td>
                    <td><Link href={`/management/students/${s.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {students.length === 0 && (
            <EmptyState title="No students found" message={searchTerm ? `No match for "${searchTerm}"` : "No students in system"} />
          )}
        </div>
      </div>
    </div>
  );
}
