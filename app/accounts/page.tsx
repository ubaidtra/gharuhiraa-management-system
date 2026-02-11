"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/utils/format";

export default function AccountsDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    recentPayments: [] as any[],
    recentWithdrawals: [] as any[],
    totalRevenue: 0,
    totalWithdrawals: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      Promise.all([fetch("/api/students"), fetch("/api/teachers"), fetch("/api/transactions")])
        .then(([s, t, tr]) => Promise.all([s.json(), t.json(), tr.json()]))
        .then(([students, teachers, transactions]) => {
          const payments = transactions.filter((x: any) => x.type !== "WITHDRAWAL");
          const withdrawals = transactions.filter((x: any) => x.type === "WITHDRAWAL");
          setStats({
            totalStudents: Array.isArray(students) ? students.length : 0,
            totalTeachers: Array.isArray(teachers) ? teachers.length : 0,
            recentPayments: payments.slice(0, 3),
            recentWithdrawals: withdrawals.slice(0, 3),
            totalRevenue: payments.reduce((sum: number, t: any) => sum + Number(t.amount), 0),
            totalWithdrawals: withdrawals.reduce((sum: number, t: any) => sum + Number(t.amount), 0),
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading dashboard..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accounts Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Students" value={stats.totalStudents} color="blue" />
          <StatCard title="Total Teachers" value={stats.totalTeachers} color="green" />
          <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} color="green" />
          <StatCard title="Total Expenses" value={formatCurrency(stats.totalWithdrawals)} color="red" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/accounts/students/new" className="btn-primary text-center text-sm py-3">Register Student</Link>
              <Link href="/accounts/teachers/new" className="btn-primary text-center text-sm py-3">Add Teacher</Link>
              <Link href="/accounts/halaqas/new" className="btn-primary text-center text-sm py-3">Create Halaqa</Link>
              <Link href="/accounts/transactions/new" className="btn-primary text-center text-sm py-3">Record Payment</Link>
              <Link href="/accounts/withdrawals/new" className="btn-danger text-center text-sm py-3">Record Withdrawal</Link>
            </div>
          </div>
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-700">Revenue:</span><span className="text-2xl font-bold text-green-600">+{formatCurrency(stats.totalRevenue)}</span></div>
              <div className="flex justify-between"><span className="text-gray-700">Expenses:</span><span className="text-2xl font-bold text-red-600">-{formatCurrency(stats.totalWithdrawals)}</span></div>
              <div className="border-t pt-3 flex justify-between"><span className="font-semibold">Net:</span><span className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalRevenue - stats.totalWithdrawals)}</span></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Payments</h2>
              <Link href="/accounts/transactions" className="text-blue-600 hover:text-blue-800 text-sm">View All</Link>
            </div>
            {stats.recentPayments.length === 0 ? (
              <EmptyState title="No payments yet" message="Record your first payment" actionLabel="Record Payment" onAction={() => (window.location.href = "/accounts/transactions/new")} />
            ) : (
              <div className="space-y-2">
                {stats.recentPayments.map((p) => (
                  <div key={p.id} className="flex justify-between border-b pb-2">
                    <span className="text-sm">{p.type?.replace(/_/g, " ")} - {new Date(p.date).toLocaleDateString()}</span>
                    <span className="text-green-600 font-semibold">+{formatCurrency(Number(p.amount))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Withdrawals</h2>
              <Link href="/accounts/withdrawals" className="text-red-600 hover:text-red-800 text-sm">View All</Link>
            </div>
            {stats.recentWithdrawals.length === 0 ? (
              <EmptyState title="No withdrawals yet" message="Record your first withdrawal" actionLabel="Record Withdrawal" onAction={() => (window.location.href = "/accounts/withdrawals/new")} />
            ) : (
              <div className="space-y-2">
                {stats.recentWithdrawals.map((w) => (
                  <div key={w.id} className="flex justify-between border-b pb-2">
                    <span className="text-sm">{w.description || "Withdrawal"} - {new Date(w.date).toLocaleDateString()}</span>
                    <span className="text-red-600 font-semibold">-{formatCurrency(Number(w.amount))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
