"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import StatCard from "@/components/StatCard";
import ErrorMessage from "@/components/ErrorMessage";
import { formatCurrency } from "@/lib/utils/format";

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
    return <LoadingPage message="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ErrorMessage message="Error loading dashboard data. Please refresh the page." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Director Dashboard</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/management/financial-reports"
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Financial Reports
            </Link>
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold">
              Read-Only Access
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.overview.totalStudents}
            color="blue"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Teachers"
            value={stats.overview.totalTeachers}
            color="green"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Total Halaqas"
            value={stats.overview.totalHalaqas}
            color="purple"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <StatCard
            title="Net Balance"
            value={formatCurrency(stats.overview.netBalance)}
            color="orange"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
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

