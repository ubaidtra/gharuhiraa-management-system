"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";

export default function ManagementTeachersPage() {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "MANAGEMENT") {
      fetch("/api/teachers").then((r) => r.json()).then(setTeachers).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading teachers..." />;

  const filtered = teachers.filter((t) =>
    `${t.teacherId} ${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const halaqaCount = (t: any) => (t.halaqas || t.Halaqa || []).length;
  const studentCount = (t: any) => (t.halaqas || t.Halaqa || []).reduce((s: number, h: any) => s + (h.students?.length || h.Student?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teachers</h1>
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td className="font-mono text-sm font-semibold">{t.teacherId}</td>
                    <td>{t.firstName} {t.lastName}</td>
                    <td>{t.gender}</td>
                    <td>{t.employmentType?.replace(/_/g, " ") || "-"}</td>
                    <td>{halaqaCount(t)}</td>
                    <td>{studentCount(t)}</td>
                    <td><span className={`px-2 py-1 rounded text-xs ${t.isActive !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{t.isActive !== false ? "Active" : "Inactive"}</span></td>
                    <td><Link href={`/management/teachers/${t.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <EmptyState title="No teachers found" message={searchTerm ? `No match for "${searchTerm}"` : "No teachers in system"} />
          )}
        </div>
      </div>
    </div>
  );
}
