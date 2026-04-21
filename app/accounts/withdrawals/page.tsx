"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/utils/format";

export default function WithdrawalsPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS") {
      fetch("/api/transactions?type=WITHDRAWAL").then((r) => r.json()).then(setTransactions).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading withdrawals..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
          <Link href="/accounts/withdrawals/new" className="btn-primary">Record Withdrawal</Link>
        </div>
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                    <td className="text-red-600 font-medium">-{formatCurrency(Number(t.amount))}</td>
                    <td className="max-w-[300px] truncate">{t.description || "-"}</td>
                    <td>
                      {t.photoUrl ? (
                        <a href={t.photoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <EmptyState title="No withdrawals" message="Record your first withdrawal" actionLabel="Record Withdrawal" onAction={() => (window.location.href = "/accounts/withdrawals/new")} />
          )}
        </div>
      </div>
    </div>
  );
}
