"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/lib/utils/format";

export default function StatisticsPage() {
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

  if (loading || status === "loading") return <LoadingPage message="Loading statistics..." />;

  const ov = stats?.overview || {};
  const lp = stats?.learningProgress || {};
  const halaqas = stats?.halaqas || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard title="Students" value={ov.totalStudents ?? 0} />
          <StatCard title="Teachers" value={ov.totalTeachers ?? 0} />
          <StatCard title="Halaqas" value={ov.totalHalaqas ?? 0} />
          <StatCard title="Revenue" value={formatCurrency(ov.totalRevenue ?? 0)} />
          <StatCard title="Net Balance" value={formatCurrency(ov.netBalance ?? 0)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Total Revenue</span><span className="text-green-600 font-medium">{formatCurrency(ov.totalRevenue ?? 0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Withdrawals</span><span className="text-red-600 font-medium">{formatCurrency(ov.totalWithdrawals ?? 0)}</span></div>
              <div className="flex justify-between border-t pt-2"><span className="font-medium">Net Balance</span><span className="font-bold">{formatCurrency(ov.netBalance ?? 0)}</span></div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Learning Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">Total Memorized Days</span><span>{lp.totalMemorizedDays ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Murajaa Days</span><span>{lp.totalMurajaaDays ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Total Rubu</span><span>{lp.totalRubu ?? 0}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Avg Memorized/Week</span><span>{(lp.averageMemorizedPerWeek ?? 0).toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Halaqas Overview</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Halaqa</th>
                  <th>Teacher</th>
                  <th>Students</th>
                </tr>
              </thead>
              <tbody>
                {halaqas.map((h: any) => (
                  <tr key={h.id}>
                    <td className="font-medium">{h.name}</td>
                    <td>{h.teacherName}</td>
                    <td>{h.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {halaqas.length === 0 && <p className="text-gray-500 py-4">No halaqas</p>}
        </div>
      </div>
    </div>
  );
}
