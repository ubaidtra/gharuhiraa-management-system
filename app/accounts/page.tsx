"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes, transactionsRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/teachers"),
          fetch("/api/transactions"),
        ]);

        const students = await studentsRes.json();
        const teachers = await teachersRes.json();
        const transactions = await transactionsRes.json();

        const payments = transactions.filter((t: any) => t.type !== "WITHDRAWAL");
        const withdrawals = transactions.filter((t: any) => t.type === "WITHDRAWAL");

        setStats({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          recentPayments: payments.slice(0, 3),
          recentWithdrawals: withdrawals.slice(0, 3),
          totalRevenue: payments.reduce((sum: number, t: any) => sum + t.amount, 0),
          totalWithdrawals: withdrawals.reduce((sum: number, t: any) => sum + t.amount, 0),
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "ACCOUNTS") {
      fetchStats();
    }
  }, [session]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accounts and Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalStudents}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Teachers</h3>
            <p className="text-4xl font-bold text-green-600">{stats.totalTeachers}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold text-green-600">D{stats.totalRevenue.toFixed(0)}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Expenses</h3>
            <p className="text-4xl font-bold text-red-600">D{stats.totalWithdrawals.toFixed(0)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/accounts/students/new" className="btn-primary text-center text-sm py-3">
                Register Student
              </Link>
              <Link href="/accounts/teachers/new" className="btn-primary text-center text-sm py-3">
                Add Teacher
              </Link>
              <Link href="/accounts/halaqas/new" className="btn-primary text-center text-sm py-3">
                Create Halaqa
              </Link>
              <Link href="/accounts/transactions/new" className="btn-primary text-center text-sm py-3">
                Record Payment
              </Link>
              <Link href="/accounts/withdrawals/new" className="btn-danger text-center text-sm py-3">
                Record Withdrawal
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Revenue:</span>
                <span className="text-2xl font-bold text-green-600">
                  +D{stats.totalRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Expenses:</span>
                <span className="text-2xl font-bold text-red-600">
                  -D{stats.totalWithdrawals.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-900 font-semibold">Net Balance:</span>
                <span className="text-2xl font-bold text-blue-600">
                  D{(stats.totalRevenue - stats.totalWithdrawals).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Payments</h2>
              <Link href="/accounts/transactions" className="text-blue-600 hover:text-blue-800 text-sm">
                View All →
              </Link>
            </div>
            {stats.recentPayments.length === 0 ? (
              <p className="text-gray-500">No payments yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentPayments.map((payment) => (
                  <div key={payment.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{payment.type.replace(/_/g, " ")}</span>
                      <span className="text-green-600 font-semibold">
                        +D{payment.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Withdrawals</h2>
              <Link href="/accounts/withdrawals" className="text-red-600 hover:text-red-800 text-sm">
                View All →
              </Link>
            </div>
            {stats.recentWithdrawals.length === 0 ? (
              <p className="text-gray-500">No withdrawals yet</p>
            ) : (
              <div className="space-y-2">
                {stats.recentWithdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{withdrawal.description || "Withdrawal"}</span>
                      <span className="text-red-600 font-semibold">
                        -D{withdrawal.amount.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(withdrawal.date).toLocaleDateString()}
                    </p>
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

