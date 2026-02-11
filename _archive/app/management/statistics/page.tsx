"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function ManagementStatisticsPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "MANAGEMENT") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/statistics");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT") {
      fetchStats();
    }
  }, [session]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!stats) {
    return <div className="flex justify-center items-center min-h-screen">Error loading data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Detailed Statistics</h1>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Financial Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  D{stats.overview.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-3xl font-bold text-red-600">
                  D{stats.overview.totalWithdrawals.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Balance</p>
                <p className="text-3xl font-bold text-blue-600">
                  D{stats.overview.netBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Enrollment Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.overview.totalStudents}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.overview.totalTeachers}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Halaqas</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.overview.totalHalaqas}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Learning Progress Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Memorized Days</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.learningProgress.totalMemorizedDays}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Murajaa Days</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.learningProgress.totalMurajaaDays}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rubu Completed</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.learningProgress.totalRubu.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Memorized/Week</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.learningProgress.averageMemorizedPerWeek.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Halaqa Distribution</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Halaqa Name</th>
                    <th>Teacher</th>
                    <th>Student Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.halaqas.map((halaqa: any) => (
                    <tr key={halaqa.id}>
                      <td>{halaqa.name}</td>
                      <td>{halaqa.teacherName}</td>
                      <td>{halaqa.studentCount}</td>
                      <td>
                        {stats.overview.totalStudents > 0
                          ? (
                              (halaqa.studentCount / stats.overview.totalStudents) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card bg-yellow-50 border-2 border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">
              Management Access Notice
            </h3>
            <p className="text-yellow-800">
              As a Director, you have read-only access to all data. You can view
              statistics, student records, teacher information, and learning progress, but
              you cannot make any modifications to financial records or learning data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

