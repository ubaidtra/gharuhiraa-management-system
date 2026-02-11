"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getRoleDisplayName } from "@/lib/roleDisplay";

export default function FinancialReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reportType, setReportType] = useState<string>("MONTHLY");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter states
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedHalaqas, setSelectedHalaqas] = useState<string[]>([]);
  const [includeWithdrawals, setIncludeWithdrawals] = useState(true);

  // Data for filters
  const [students, setStudents] = useState<any[]>([]);
  const [halaqas, setHalaqas] = useState<any[]>([]);

  const transactionTypes = [
    "MONTHLY_FEE",
    "REGISTRATION_FEE",
    "BOOK_FEE",
    "EXAM_FEE",
    "OTHER",
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "MANAGEMENT") {
      redirect("/");
    }
  }, [session, status]);

  // Fetch students and halaqas for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [studentsRes, halaqasRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/halaqas"),
        ]);

        if (studentsRes.ok) {
          const studentsData = await studentsRes.json();
          setStudents(studentsData);
        }

        if (halaqasRes.ok) {
          const halaqasData = await halaqasRes.json();
          setHalaqas(halaqasData);
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    if (session?.user.role === "MANAGEMENT") {
      fetchFilterData();
    }
  }, [session]);

  // Calculate date ranges based on report type
  const getDateRange = (type: string) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (type) {
      case "WEEKLY":
        // Current week (Sunday to Saturday)
        const dayOfWeek = today.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
        endDate = new Date(today);
        break;

      case "MONTHLY":
        // Current month
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;

      case "YEARLY":
        // Current year
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31);
        break;

      case "CUSTOM":
        return { startDate: customStartDate, endDate: customEndDate };

      default:
        break;
    }

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const handleGenerateReport = () => {
    setLoading(true);
    const { startDate, endDate } = getDateRange(reportType);

    if (reportType === "CUSTOM" && (!customStartDate || !customEndDate)) {
      alert("Please select both start and end dates for custom report.");
      setLoading(false);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("Start date must be before end date.");
      setLoading(false);
      return;
    }

    // Build query params with filters
    const params = new URLSearchParams({
      type: reportType,
      startDate,
      endDate,
      includeWithdrawals: includeWithdrawals.toString(),
    });

    // Add filters if any are selected
    if (selectedTransactionTypes.length > 0) {
      params.append("transactionTypes", selectedTransactionTypes.join(","));
    }
    if (selectedStudents.length > 0) {
      params.append("studentIds", selectedStudents.join(","));
    }
    if (selectedHalaqas.length > 0) {
      params.append("halaqaIds", selectedHalaqas.join(","));
    }

    router.push(`/management/financial-reports/print?${params.toString()}`);
  };

  const toggleTransactionType = (type: string) => {
    setSelectedTransactionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((s) => s !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleHalaqa = (halaqaId: string) => {
    setSelectedHalaqas((prev) =>
      prev.includes(halaqaId)
        ? prev.filter((h) => h !== halaqaId)
        : [...prev, halaqaId]
    );
  };

  const clearAllFilters = () => {
    setSelectedTransactionTypes([]);
    setSelectedStudents([]);
    setSelectedHalaqas([]);
    setIncludeWithdrawals(true);
  };

  const hasActiveFilters =
    selectedTransactionTypes.length > 0 ||
    selectedStudents.length > 0 ||
    selectedHalaqas.length > 0 ||
    !includeWithdrawals;

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  const currentRange = getDateRange(reportType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Financial Reports
        </h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-800">
              Generate comprehensive financial reports for different time periods.
              Reports include revenue, expenses, and detailed transaction breakdowns.
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Generate Report</h2>

          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Report Period
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => setReportType("WEEKLY")}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    reportType === "WEEKLY"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        reportType === "WEEKLY"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {reportType === "WEEKLY" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Weekly Report</p>
                      <p className="text-xs text-gray-600">
                        Current week (Sunday - Today)
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setReportType("MONTHLY")}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    reportType === "MONTHLY"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        reportType === "MONTHLY"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {reportType === "MONTHLY" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Monthly Report</p>
                      <p className="text-xs text-gray-600">Current month</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setReportType("YEARLY")}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    reportType === "YEARLY"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        reportType === "YEARLY"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {reportType === "YEARLY" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Yearly Report</p>
                      <p className="text-xs text-gray-600">Current year</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setReportType("CUSTOM")}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    reportType === "CUSTOM"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        reportType === "CUSTOM"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {reportType === "CUSTOM" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Custom Range</p>
                      <p className="text-xs text-gray-600">Select custom dates</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Date Range */}
            {reportType === "CUSTOM" && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Select Custom Date Range
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Date Range Preview */}
            {reportType !== "CUSTOM" && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-sm font-semibold text-green-900 mb-2">
                  Report Date Range
                </h3>
                <p className="text-sm text-green-800">
                  <strong>From:</strong>{" "}
                  {new Date(currentRange.startDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-green-800 mt-1">
                  <strong>To:</strong>{" "}
                  {new Date(currentRange.endDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}

            {/* Advanced Filters */}
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Advanced Filters
                  </h3>
                  {hasActiveFilters && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                      {selectedTransactionTypes.length + selectedStudents.length + selectedHalaqas.length + (!includeWithdrawals ? 1 : 0)} active
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    {showAdvancedFilters ? "Hide" : "Show"} Filters
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        showAdvancedFilters ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {showAdvancedFilters && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  {/* Include Withdrawals */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeWithdrawals}
                        onChange={(e) => setIncludeWithdrawals(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        Include Expenses (Withdrawals) in Report
                      </span>
                    </label>
                  </div>

                  {/* Transaction Type Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Filter by Transaction Type
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {transactionTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTransactionTypes.includes(type)}
                            onChange={() => toggleTransactionType(type)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {type.replace(/_/g, " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedTransactionTypes.length === 0
                        ? "All transaction types included"
                        : `${selectedTransactionTypes.length} type(s) selected`}
                    </p>
                  </div>

                  {/* Halaqa Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Filter by Halaqa
                    </h4>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                      {halaqas.length === 0 ? (
                        <p className="text-sm text-gray-500 p-2">No halaqas found</p>
                      ) : (
                        halaqas.map((halaqa) => (
                          <label
                            key={halaqa.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedHalaqas.includes(halaqa.id)}
                              onChange={() => toggleHalaqa(halaqa.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {halaqa.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedHalaqas.length === 0
                        ? "All halaqas included"
                        : `${selectedHalaqas.length} halaqa(s) selected`}
                    </p>
                  </div>

                  {/* Student Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Filter by Student
                    </h4>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                      {students.length === 0 ? (
                        <p className="text-sm text-gray-500 p-2">No students found</p>
                      ) : (
                        students.map((student) => (
                          <label
                            key={student.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.id)}
                              onChange={() => toggleStudent(student.id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {student.firstName} {student.lastName} ({student.studentId})
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedStudents.length === 0
                        ? "All students included"
                        : `${selectedStudents.length} student(s) selected`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="flex gap-4">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {loading ? "Generating..." : "Generate & Print Report"}
              </button>

              <button
                onClick={() => router.back()}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Information Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Report Contents
          </h3>
          <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Total Revenue (all student payments)</li>
            <li>Total Expenses (all withdrawals)</li>
            <li>Net Balance (revenue - expenses)</li>
            <li>Revenue breakdown by transaction type</li>
            <li>Detailed transaction lists</li>
            <li>School statistics (students, teachers, halaqas)</li>
            <li>Print-ready format with school branding</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

