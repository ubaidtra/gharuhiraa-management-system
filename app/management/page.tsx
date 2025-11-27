"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ManagementDashboard() {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Director Dashboard</h1>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
            Read-Only Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-blue-600">
              {stats.overview.totalStudents}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Teachers</h3>
            <p className="text-4xl font-bold text-green-600">
              {stats.overview.totalTeachers}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Halaqas</h3>
            <p className="text-4xl font-bold text-purple-600">
              {stats.overview.totalHalaqas}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Net Balance</h3>
            <p className="text-4xl font-bold text-indigo-600">
              D{stats.overview.netBalance.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              D{stats.overview.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Withdrawals</h3>
            <p className="text-3xl font-bold text-red-600">
              D{stats.overview.totalWithdrawals.toFixed(2)}
            </p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Avg Memorization/Week</h3>
            <p className="text-3xl font-bold text-orange-600">
              {stats.learningProgress.averageMemorizedPerWeek.toFixed(1)} days
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Learning Progress Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Total Memorized Days:</span>
                <span className="font-semibold text-blue-600">
                  {stats.learningProgress.totalMemorizedDays}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Murajaa Days:</span>
                <span className="font-semibold text-green-600">
                  {stats.learningProgress.totalMurajaaDays}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Total Rubu Completed:</span>
                <span className="font-semibold text-purple-600">
                  {stats.learningProgress.totalRubu.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link
                href="/management/students"
                className="block btn-primary text-center"
              >
                View All Students
              </Link>
              <Link
                href="/management/teachers"
                className="block btn-primary text-center"
              >
                View All Teachers
              </Link>
              <Link
                href="/management/statistics"
                className="block btn-primary text-center"
              >
                Detailed Statistics
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Halaqas Overview</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Halaqa Name</th>
                  <th>Teacher</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.halaqas.map((halaqa: any) => (
                  <tr key={halaqa.id}>
                    <td>{halaqa.name}</td>
                    <td>{halaqa.teacherName}</td>
                    <td>{halaqa.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

