"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency, formatMonthValue } from "@/lib/utils/format";

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      const url = filter ? `/api/transactions?type=${filter}` : "/api/transactions";
      fetch(url).then((r) => r.json()).then(setTransactions).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, filter]);

  if (loading || status === "loading") return <LoadingPage message="Loading transactions..." />;

  const studentName = (t: any) => {
    const s = t.Student || t.student;
    return s ? `${s.firstName} ${s.lastName}` : "-";
  };
  const isWithdrawal = (t: any) => t.type === "WITHDRAWAL";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <Link href="/accounts/transactions/new" className="btn-primary">Record Payment</Link>
        </div>
        <div className="card mb-6">
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilter("")} className={`px-4 py-2 rounded ${!filter ? "bg-blue-600 text-white" : "bg-gray-100"}`}>All</button>
            <button onClick={() => setFilter("REGISTRATION_FEE")} className={`px-4 py-2 rounded ${filter === "REGISTRATION_FEE" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Registration</button>
            <button onClick={() => setFilter("SCHOOL_FEE")} className={`px-4 py-2 rounded ${filter === "SCHOOL_FEE" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>School Fee</button>
            <button onClick={() => setFilter("UNIFORM_FEE")} className={`px-4 py-2 rounded ${filter === "UNIFORM_FEE" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Uniform</button>
            <button onClick={() => setFilter("OTHER_FEE")} className={`px-4 py-2 rounded ${filter === "OTHER_FEE" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Other</button>
            <button onClick={() => setFilter("WITHDRAWAL")} className={`px-4 py-2 rounded ${filter === "WITHDRAWAL" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>Withdrawals</button>
          </div>
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Student</th>
                  <th>Paid For</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td>{TRANSACTION_TYPE_LABELS[t.type] || t.type}</td>
                    <td>{studentName(t)}</td>
                    <td>{t.paidForMonth ? formatMonthValue(t.paidForMonth) : "-"}</td>
                    <td className={isWithdrawal(t) ? "text-red-600" : "text-green-600"}>{isWithdrawal(t) ? "-" : ""}{formatCurrency(Number(t.amount))}</td>
                    <td className="max-w-[200px] truncate">{t.description || "-"}</td>
                    <td>
                      {!isWithdrawal(t) && (
                        <Link href={`/accounts/transactions/${t.id}/receipt`} className="text-blue-600 hover:text-blue-800 text-sm">Receipt</Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <EmptyState
              title="No transactions"
              message={filter ? `No ${filter.toLowerCase().replace(/_/g, " ")} records` : "Record your first payment"}
              actionLabel={!filter ? "Record Payment" : undefined}
              onAction={!filter ? () => (window.location.href = "/accounts/transactions/new") : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
