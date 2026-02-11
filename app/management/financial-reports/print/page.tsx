"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import { formatCurrency } from "@/lib/utils/format";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";

function PrintContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  useEffect(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const includeWithdrawals = searchParams.get("includeWithdrawals") ?? "true";
    if (!startDate || !endDate || session?.user.role !== "MANAGEMENT") {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams({ type: "REVENUE_EXPENSE", startDate, endDate, includeWithdrawals });
    fetch(`/api/financial-reports?${params}`)
      .then((r) => r.json())
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session, searchParams]);

  useEffect(() => {
    if (report) window.print();
  }, [report]);

  if (loading || status === "loading") return <LoadingPage message="Loading report..." />;
  if (!report) return <div className="p-8 text-center text-gray-500">Invalid or missing report parameters</div>;

  const rev = report.transactions?.revenue || [];
  const exp = report.transactions?.expenses || [];
  const sum = report.summary || {};

  return (
    <div className="max-w-4xl mx-auto p-8 print:p-4 bg-white">
      <h1 className="text-2xl font-bold mb-2">Financial Report</h1>
      <p className="text-gray-600 mb-6">
        {searchParams.get("startDate")} to {searchParams.get("endDate")} | Generated {new Date().toLocaleString()}
      </p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(sum.totalRevenue ?? 0)}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(sum.totalExpenses ?? 0)}</p>
        </div>
        <div className="border p-4">
          <p className="text-sm text-gray-500">Net Balance</p>
          <p className="text-xl font-bold">{formatCurrency(sum.netBalance ?? 0)}</p>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue ({rev.length})</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Student</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rev.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td>{TRANSACTION_TYPE_LABELS[t.type] || t.type}</td>
                <td>{t.Student ? `${t.Student.firstName} ${t.Student.lastName}` : "-"}</td>
                <td className="text-right text-green-600">{formatCurrency(Number(t.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Withdrawals ({exp.length})</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Date</th>
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {exp.map((t: any) => (
              <tr key={t.id} className="border-b">
                <td className="py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.description || "-"}</td>
                <td className="text-right text-red-600">{formatCurrency(Number(t.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-8 text-center">Cave of Hiraa Management System</p>
    </div>
  );
}

export default function FinancialPrintPage() {
  return (
    <Suspense fallback={<LoadingPage message="Loading..." />}>
      <PrintContent />
    </Suspense>
  );
}
