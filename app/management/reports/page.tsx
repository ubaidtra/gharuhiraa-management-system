"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function ManagementReportsPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, WEEKLY, MONTHLY, UNREAD

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "MANAGEMENT") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/reports");
        const data = await res.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT") {
      fetchReports();
    }
  }, [session]);

  const filteredReports = reports.filter((report) => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !report.isRead;
    return report.reportType === filter;
  });

  const unreadCount = reports.filter((r) => !r.isRead).length;

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Reports</h1>
          <p className="text-gray-600">
            View weekly and monthly reports submitted by teachers
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  filter === "ALL"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setFilter("UNREAD")}
                className={`px-4 py-2 rounded text-sm font-medium transition relative ${
                  filter === "UNREAD"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setFilter("WEEKLY")}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  filter === "WEEKLY"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setFilter("MONTHLY")}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  filter === "MONTHLY"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "ALL"
                  ? "Teachers haven't submitted any reports yet."
                  : `No ${filter.toLowerCase()} reports found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition ${
                    !report.isRead
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {!report.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            report.reportType === "WEEKLY"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {report.reportType}
                        </span>
                        {!report.isRead && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {report.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>
                          From: {report.teacher.firstName} {report.teacher.lastName} ({report.teacher.teacherId})
                        </span>
                        <span>•</span>
                        <span>
                          Submitted: {new Date(report.createdAt).toLocaleDateString()} at{" "}
                          {new Date(report.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/management/reports/${report.id}`}
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
                    >
                      Read Report →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

