"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/lib/utils/format";

export default function ManagementDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "MANAGEMENT") {
      fetch("/api/statistics").then((r) => r.json()).then(setStats).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading dashboard..." />;
  const ov = stats?.overview || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Management Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/management/students"><StatCard title="Students" value={ov.totalStudents ?? 0} /></Link>
          <Link href="/management/teachers"><StatCard title="Teachers" value={ov.totalTeachers ?? 0} /></Link>
          <StatCard title="Halaqas" value={ov.totalHalaqas ?? 0} />
          <Link href="/management/financial-reports"><StatCard title="Net Balance" value={formatCurrency(ov.netBalance ?? 0)} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Revenue & Expenses</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Total Revenue</span><span className="text-green-600 font-medium">{formatCurrency(ov.totalRevenue ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Withdrawals</span><span className="text-red-600 font-medium">{formatCurrency(ov.totalWithdrawals ?? 0)}</span></div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Memorized Days</span><span>{(stats?.learningProgress?.totalMemorizedDays ?? 0).toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Murajaa Days</span><span>{(stats?.learningProgress?.totalMurajaaDays ?? 0).toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Rubu</span><span>{(stats?.learningProgress?.totalRubu ?? 0).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/management/students" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">Students</h3>
            <p className="text-gray-500 mt-1">View student records</p>
          </Link>
          <Link href="/management/teachers" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">Teachers</h3>
            <p className="text-gray-500 mt-1">View teacher profiles</p>
          </Link>
          <Link href="/management/statistics" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">Statistics</h3>
            <p className="text-gray-500 mt-1">Overview and analytics</p>
          </Link>
          <Link href="/management/financial-reports" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">Financial Reports</h3>
            <p className="text-gray-500 mt-1">Revenue and expenses</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
