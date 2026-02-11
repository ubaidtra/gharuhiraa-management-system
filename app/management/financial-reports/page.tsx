"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import FormField from "@/components/FormField";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useToast } from "@/components/Toast";
import { formatCurrency } from "@/lib/utils/format";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";

export default function FinancialReportsPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [formData, setFormData] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    includeWithdrawals: "true",
  });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);
    try {
      const params = new URLSearchParams({
        type: "REVENUE_EXPENSE",
        startDate: formData.startDate,
        endDate: formData.endDate,
        includeWithdrawals: formData.includeWithdrawals,
      });
      const res = await fetch(`/api/financial-reports?${params}`);
      const data = await res.json();
      if (res.ok) setReport(data);
      else showToast("error", data.error || "Failed");
    } catch { showToast("error", "Failed"); }
    finally { setLoading(false); }
  };

  const printUrl = report ? `/management/financial-reports/print?startDate=${formData.startDate}&endDate=${formData.endDate}&includeWithdrawals=${formData.includeWithdrawals}` : "#";

  if (status === "loading") return <LoadingPage message="Loading..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Reports</h1>
        <form onSubmit={handleGenerate} className="card mb-8 max-w-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Start Date" name="startDate" required>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="input-field" required disabled={loading} />
            </FormField>
            <FormField label="End Date" name="endDate" required>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="input-field" required disabled={loading} />
            </FormField>
            <FormField label="Include Withdrawals" name="includeWithdrawals">
              <select name="includeWithdrawals" value={formData.includeWithdrawals} onChange={handleChange} className="input-field" disabled={loading}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </FormField>
          </div>
          <div className="mt-4">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <LoadingSpinner size="sm" /> : null} Generate Report
            </button>
          </div>
        </form>

        {report && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Report: {formData.startDate} to {formData.endDate}</h2>
              <a href={printUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">Print</a>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><p className="text-sm text-gray-500">Total Revenue</p><p className="text-green-600 font-bold">{formatCurrency(report.summary?.totalRevenue ?? 0)}</p></div>
                <div><p className="text-sm text-gray-500">Total Expenses</p><p className="text-red-600 font-bold">{formatCurrency(report.summary?.totalExpenses ?? 0)}</p></div>
                <div><p className="text-sm text-gray-500">Net Balance</p><p className="font-bold">{formatCurrency(report.summary?.netBalance ?? 0)}</p></div>
                <div><p className="text-sm text-gray-500">Transactions</p><p>{report.summary?.totalTransactionCount ?? 0}</p></div>
              </div>
            </div>
            {report.revenueByType && Object.keys(report.revenueByType).length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Revenue by Type</h3>
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr><th>Type</th><th>Count</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                      {Object.entries(report.revenueByType).map(([type, val]: [string, any]) => (
                        <tr key={type}>
                          <td>{TRANSACTION_TYPE_LABELS[type] || type}</td>
                          <td>{val.count}</td>
                          <td className="text-green-600">{formatCurrency(val.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Revenue ({report.transactions?.revenue?.length ?? 0})</h3>
                <div className="table-container max-h-64 overflow-auto">
                  <table className="table">
                    <thead>
                      <tr><th>Date</th><th>Type</th><th>Student</th><th>Amount</th></tr>
                    </thead>
                    <tbody>
                      {(report.transactions?.revenue || []).slice(0, 20).map((t: any) => (
                        <tr key={t.id}>
                          <td>{new Date(t.date).toLocaleDateString()}</td>
                          <td>{TRANSACTION_TYPE_LABELS[t.type] || t.type}</td>
                          <td>{t.Student ? `${t.Student.firstName} ${t.Student.lastName}` : "-"}</td>
                          <td className="text-green-600">{formatCurrency(Number(t.amount))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(report.transactions?.revenue?.length ?? 0) > 20 && <p className="text-sm text-gray-500 mt-2">Showing 20 of {report.transactions.revenue.length}</p>}
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Withdrawals ({report.transactions?.expenses?.length ?? 0})</h3>
                <div className="table-container max-h-64 overflow-auto">
                  <table className="table">
                    <thead>
                      <tr><th>Date</th><th>Amount</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                      {(report.transactions?.expenses || []).slice(0, 20).map((t: any) => (
                        <tr key={t.id}>
                          <td>{new Date(t.date).toLocaleDateString()}</td>
                          <td className="text-red-600">{formatCurrency(Number(t.amount))}</td>
                          <td className="max-w-[150px] truncate">{t.description || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(report.transactions?.expenses?.length ?? 0) > 20 && <p className="text-sm text-gray-500 mt-2">Showing 20 of {report.transactions.expenses.length}</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
