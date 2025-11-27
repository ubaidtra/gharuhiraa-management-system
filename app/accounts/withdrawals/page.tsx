"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function WithdrawalsPage() {
  const { data: session, status } = useSession();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
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
    const fetchWithdrawals = async () => {
      try {
        const res = await fetch("/api/transactions?type=WITHDRAWAL");
        const data = await res.json();
        setWithdrawals(data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "ACCOUNTS") {
      fetchWithdrawals();
    }
  }, [session]);

  const totalWithdrawals = withdrawals.reduce((sum, w) => sum + w.amount, 0);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
            <p className="text-gray-600 mt-1">Track all expense withdrawals and payments</p>
          </div>
          <Link href="/accounts/withdrawals/new" className="btn-primary">
            Record Withdrawal
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Withdrawals</h3>
            <p className="text-4xl font-bold text-red-600">D{totalWithdrawals.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">{withdrawals.length} transactions</p>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Month:</span>
                <span className="font-semibold text-red-600">
                  ${withdrawals
                    .filter(w => new Date(w.date).getMonth() === new Date().getMonth())
                    .reduce((sum, w) => sum + w.amount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Withdrawal:</span>
                <span className="font-semibold">
                  D{withdrawals.length > 0 ? (totalWithdrawals / withdrawals.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Withdrawal History</h2>
            <Link href="/accounts/transactions" className="text-blue-600 hover:text-blue-800 text-sm">
              View Payments →
            </Link>
          </div>
          
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Check Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td>{new Date(withdrawal.date).toLocaleDateString()}</td>
                    <td>
                      <div className="font-medium">{withdrawal.description || "General expense"}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(withdrawal.date).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="text-red-600 font-semibold">
                      -D{withdrawal.amount.toFixed(2)}
                    </td>
                    <td>
                      {withdrawal.photoUrl ? (
                        <a 
                          href={withdrawal.photoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Check
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">No photo</span>
                      )}
                    </td>
                    <td>
                      <Link
                        href={`/accounts/transactions/${withdrawal.id}/receipt`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {withdrawals.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No withdrawals recorded yet.</p>
              <Link href="/accounts/withdrawals/new" className="btn-primary inline-block">
                Record First Withdrawal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

