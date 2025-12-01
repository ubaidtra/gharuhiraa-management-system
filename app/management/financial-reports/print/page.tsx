"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, Suspense } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Image from "next/image";
import { formatCurrency } from "@/lib/currency";
import { getRoleDisplayName } from "@/lib/roleDisplay";

function FinancialReportPrintContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const reportType = searchParams.get("type") || "MONTHLY";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const transactionTypes = searchParams.get("transactionTypes") || "";
  const studentIds = searchParams.get("studentIds") || "";
  const halaqaIds = searchParams.get("halaqaIds") || "";
  const includeWithdrawals = searchParams.get("includeWithdrawals") || "true";

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "MANAGEMENT") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!startDate || !endDate) {
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({
          type: reportType,
          startDate,
          endDate,
          includeWithdrawals,
        });

        // Add filters if present
        if (transactionTypes) params.append("transactionTypes", transactionTypes);
        if (studentIds) params.append("studentIds", studentIds);
        if (halaqaIds) params.append("halaqaIds", halaqaIds);

        const res = await fetch(`/api/financial-reports?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          console.error("Failed to fetch financial report");
          setReport(null);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT") {
      fetchReport();
    }
  }, [session, reportType, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading report...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to generate report</p>
          <button onClick={() => window.history.back()} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getReportTitle = () => {
    switch (reportType) {
      case "WEEKLY":
        return "Weekly Financial Report";
      case "MONTHLY":
        return "Monthly Financial Report";
      case "YEARLY":
        return "Yearly Financial Report";
      case "CUSTOM":
        return "Custom Financial Report";
      default:
        return "Financial Report";
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report,
          #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{getReportTitle()}</h1>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="btn-primary flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Report
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                Back
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div
            id="printable-report"
            ref={printRef}
            className="bg-white shadow-lg rounded-lg p-8"
          >
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <div className="flex justify-center mb-3">
                <Image
                  src="/logo.jpg"
                  alt="Gharu Hiraa Logo"
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-gray-300"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gharu Hiraa
              </h1>
              <p className="text-lg text-gray-600">
                School for Quranic Memorization
              </p>
              <p className="text-sm text-gray-500 mt-2">{getReportTitle()}</p>
            </div>

            {/* Report Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-gray-600">Report Period:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(report.startDate).toLocaleDateString()} -{" "}
                  {new Date(report.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Generated On:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(report.generatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Generated By:</p>
                <p className="font-semibold text-gray-900">
                  {session?.user.name} ({getRoleDisplayName("MANAGEMENT")})
                </p>
              </div>
              <div>
                <p className="text-gray-600">Report Type:</p>
                <p className="font-semibold text-gray-900">{reportType}</p>
              </div>
            </div>

            {/* Applied Filters */}
            {(report.filters.transactionTypes.length > 0 ||
              report.filters.studentIds.length > 0 ||
              report.filters.halaqaIds.length > 0 ||
              !report.filters.includeWithdrawals) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Applied Filters
                </h3>
                <div className="space-y-1 text-sm text-blue-800">
                  {report.filters.transactionTypes.length > 0 && (
                    <p>
                      <strong>Transaction Types:</strong>{" "}
                      {report.filters.transactionTypes.map((t: string) => t.replace(/_/g, " ")).join(", ")}
                    </p>
                  )}
                  {report.filters.halaqaIds.length > 0 && (
                    <p>
                      <strong>Filtered Halaqas:</strong> {report.filters.halaqaIds.length} selected
                    </p>
                  )}
                  {report.filters.studentIds.length > 0 && (
                    <p>
                      <strong>Filtered Students:</strong> {report.filters.studentIds.length} selected
                    </p>
                  )}
                  {!report.filters.includeWithdrawals && (
                    <p>
                      <strong>Note:</strong> Expenses (Withdrawals) excluded from this report
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="border-2 border-gray-300 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Financial Summary
              </h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-700 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatCurrency(report.summary.totalRevenue)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {report.summary.revenueTransactionCount} transactions
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-sm text-red-700 mb-1">Total Expenses</p>
                  <p className="text-3xl font-bold text-red-600">
                    {formatCurrency(report.summary.totalExpenses)}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    {report.summary.expenseTransactionCount} transactions
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-700 mb-1">Net Balance</p>
                  <p
                    className={`text-3xl font-bold ${
                      report.summary.netBalance >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(report.summary.netBalance)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {report.summary.totalTransactionCount} total transactions
                  </p>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Revenue Breakdown by Type
              </h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(report.revenueByType).map(
                      ([type, data]: [string, any]) => (
                        <tr key={type}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {type.replace(/_/g, " ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {data.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(data.amount)}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        TOTAL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {report.summary.revenueTransactionCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatCurrency(report.summary.totalRevenue)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* School Statistics */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                School Statistics
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {report.schoolStats.activeStudents}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Active Teachers</p>
                  <p className="text-2xl font-bold text-green-600">
                    {report.schoolStats.activeTeachers}
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Active Halaqas</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {report.schoolStats.totalHalaqas}
                  </p>
                </div>
              </div>
            </div>

            {/* Page Break for Printing */}
            <div className="page-break"></div>

            {/* Detailed Revenue Transactions */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detailed Revenue Transactions
              </h2>
              {report.transactions.revenue.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No revenue transactions in this period
                </p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Student
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.transactions.revenue.map((t: any) => (
                        <tr key={t.id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            {t.student
                              ? `${t.student.firstName} ${t.student.lastName} (${t.student.studentId})`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                              {t.type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-4 py-2">{t.description || "-"}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-right font-semibold text-green-600">
                            +{formatCurrency(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Detailed Expense Transactions */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detailed Expense Transactions
              </h2>
              {report.transactions.expenses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No expense transactions in this period
                </p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Description
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.transactions.expenses.map((t: any) => (
                        <tr key={t.id}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">{t.description || "Withdrawal"}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-right font-semibold text-red-600">
                            -{formatCurrency(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 pt-6 mt-8">
              <div className="text-center text-sm text-gray-600">
                <p className="font-semibold text-gray-900">
                  Gharu Hiraa - School for Quranic Memorization
                </p>
                <p className="mt-2">
                  This is an official financial report for internal use only.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  For inquiries, please contact the {getRoleDisplayName("MANAGEMENT")}{" "}
                  office.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>
                    Generated by: {session?.user.name || "System"}
                  </span>
                  <span>
                    Generated on: {new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Print Only - Signature Section */}
            <div className="print-only mt-12 pt-8 border-t-2 border-gray-300">
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                  <p className="text-sm font-semibold">Prepared By</p>
                  <p className="text-xs text-gray-600">
                    {getRoleDisplayName("MANAGEMENT")}
                  </p>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                  <p className="text-sm font-semibold">Reviewed By</p>
                  <p className="text-xs text-gray-600">
                    {getRoleDisplayName("ACCOUNTS")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function FinancialReportPrintPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <FinancialReportPrintContent />
    </Suspense>
  );
}

