"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  // Filter out withdrawals - they have their own page now
  const payments = transactions.filter(t => t.type !== "WITHDRAWAL");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "ACCOUNTS") {
      fetchTransactions();
    }
  }, [session]);

  const filteredTransactions =
    filter === "ALL"
      ? payments
      : payments.filter((t) => t.type === filter);

  const totalRevenue = payments.reduce((sum, t) => sum + t.amount, 0);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments & Fees</h1>
            <p className="text-gray-600 mt-1">Track all incoming payments from students</p>
          </div>
          <Link href="/accounts/transactions/new" className="btn-primary">
            Record Payment
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold text-green-600">D{totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">{payments.length} transactions</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Month:</span>
                <span className="font-semibold text-green-600">
                  ${payments
                    .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Payment:</span>
                <span className="font-semibold">
                  D{payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded ${
                  filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                All Payments
              </button>
              <button
                onClick={() => setFilter("REGISTRATION_FEE")}
                className={`px-4 py-2 rounded ${
                  filter === "REGISTRATION_FEE" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Registration
              </button>
              <button
                onClick={() => setFilter("SCHOOL_FEE")}
                className={`px-4 py-2 rounded ${
                  filter === "SCHOOL_FEE" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                School Fee
              </button>
              <button
                onClick={() => setFilter("UNIFORM_FEE")}
                className={`px-4 py-2 rounded ${
                  filter === "UNIFORM_FEE" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Uniform
              </button>
              <button
                onClick={() => setFilter("OTHER_FEE")}
                className={`px-4 py-2 rounded ${
                  filter === "OTHER_FEE" ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                Other
              </button>
            </div>
            <Link href="/accounts/withdrawals" className="text-red-600 hover:text-red-800 font-medium">
              View Withdrawals →
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        {transaction.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      {transaction.student
                        ? `${transaction.student.firstName} ${transaction.student.lastName}`
                        : "N/A"}
                    </td>
                    <td className="text-green-600 font-semibold">
                      +D{transaction.amount.toFixed(2)}
                    </td>
                    <td>{transaction.description || "-"}</td>
                    <td>
                      <Link
                        href={`/accounts/transactions/${transaction.id}/receipt`}
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

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No payments recorded yet.</p>
              <Link href="/accounts/transactions/new" className="btn-primary inline-block">
                Record First Payment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

