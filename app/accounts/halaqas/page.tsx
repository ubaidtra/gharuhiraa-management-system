"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";

export default function HalaqasPage() {
  const { data: session, status } = useSession();
  const [halaqas, setHalaqas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/halaqas").then((r) => r.json()).then(setHalaqas).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading halaqas..." />;

  const students = (h: any) => h.Student || h.students || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Halaqas</h1>
          <Link href="/accounts/halaqas/new" className="btn-primary">Add Halaqa</Link>
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Teacher</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {halaqas.map((h) => {
                  const teacher = h.Teacher || h.teacher;
                  const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : "-";
                  return (
                    <tr key={h.id}>
                      <td className="font-medium">{h.name}</td>
                      <td>{h.studentLevel || "-"}</td>
                      <td>{teacherName}</td>
                      <td>{students(h).length}</td>
                      <td>
                        <Link href={`/accounts/halaqas/${h.id}`} className="text-blue-600 hover:text-blue-800 text-sm">View</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {halaqas.length === 0 && (
            <EmptyState title="No halaqas" message="Add your first halaqa" actionLabel="Add Halaqa" onAction={() => (window.location.href = "/accounts/halaqas/new")} />
          )}
        </div>
      </div>
    </div>
  );
}
