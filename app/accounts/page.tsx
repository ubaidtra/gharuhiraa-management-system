"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/utils/format";
import { Transaction } from "@/types/transaction";

export default function AccountsDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    recentPayments: [] as Transaction[],
    recentWithdrawals: [] as Transaction[],
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

        const payments = transactions.filter((t: Transaction) => t.type !== "WITHDRAWAL");
        const withdrawals = transactions.filter((t: Transaction) => t.type === "WITHDRAWAL");

        setStats({
          totalStudents: students.length,
          totalTeachers: teachers.length,
          recentPayments: payments.slice(0, 3),
          recentWithdrawals: withdrawals.slice(0, 3),
          totalRevenue: payments.reduce((sum: number, t: Transaction) => sum + t.amount, 0),
          totalWithdrawals: withdrawals.reduce((sum: number, t: Transaction) => sum + t.amount, 0),
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
    return <LoadingPage message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Accounts and Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            color="blue"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            color="green"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            color="green"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(stats.totalWithdrawals)}
            color="red"
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
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
              <EmptyState
                title="No payments yet"
                message="Record your first payment to see it here"
                actionLabel="Record Payment"
                onAction={() => window.location.href = "/accounts/transactions/new"}
              />
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
              <EmptyState
                title="No withdrawals yet"
                message="Record your first withdrawal to see it here"
                actionLabel="Record Withdrawal"
                onAction={() => window.location.href = "/accounts/withdrawals/new"}
              />
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

