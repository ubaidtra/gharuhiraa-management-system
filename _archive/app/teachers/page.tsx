"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function TeachersDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    myHalaqas: [] as any[],
    totalStudents: 0,
    recentRecords: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "TEACHER") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we'd need to get the teacher ID from the user
        // For now, we'll just fetch all halaqas
        const [halaqasRes, recordsRes] = await Promise.all([
          fetch("/api/halaqas"),
          fetch("/api/learning-records"),
        ]);

        const halaqas = await halaqasRes.json();
        const records = await recordsRes.json();

        const totalStudents = halaqas.reduce(
          (sum: number, h: any) => sum + h.students.length,
          0
        );

        setStats({
          myHalaqas: halaqas,
          totalStudents,
          recentRecords: records.slice(0, 5),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "TEACHER") {
      fetchStats();
    }
  }, [session]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">My Halaqas</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.myHalaqas.length}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-green-600">{stats.totalStudents}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Learning Records</h3>
            <p className="text-4xl font-bold text-purple-600">{stats.recentRecords.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/teachers/learning-records/new"
                className="block btn-primary text-center"
              >
                Add Weekly Learning Record
              </Link>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Only Accounts and Admin staff can create new Halaqas.
                You can manage students in your assigned Halaqas.
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">My Halaqas</h2>
            {stats.myHalaqas.length === 0 ? (
              <p className="text-gray-500">No halaqas yet</p>
            ) : (
              <div className="space-y-2">
                {stats.myHalaqas.map((halaqa) => (
                  <div key={halaqa.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{halaqa.name}</span>
                      <span className="text-blue-600">
                        {halaqa.students.length} students
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Level: {halaqa.studentLevel || "Not specified"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Learning Records</h2>
          {stats.recentRecords.length === 0 ? (
            <p className="text-gray-500">No records yet</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Week Start</th>
                    <th>Student</th>
                    <th>Attendance</th>
                    <th>Memorized Days</th>
                    <th>Rubu Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{new Date(record.weekStartDate).toLocaleDateString()}</td>
                      <td>
                        {record.student.firstName} {record.student.lastName}
                      </td>
                      <td>{record.attendance} days</td>
                      <td>{record.memorizedDays} days</td>
                      <td>{record.rubuAmount} Rubu</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

