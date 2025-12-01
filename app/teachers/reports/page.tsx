"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function TeacherReportsPage() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "TEACHER") {
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

    if (session?.user.role === "TEACHER") {
      fetchReports();
    }
  }, [session]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reports to Director</h1>
          <Link href="/teachers/reports/new" className="btn-primary">
            Create New Report
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            About Reports
          </h3>
          <p className="text-sm text-blue-800">
            Use this page to send weekly or monthly reports to the Director about your Halaqa progress,
            student achievements, challenges, and any recommendations.
          </p>
        </div>

        <div className="card">
          {reports.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No reports yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first report to the Director.
              </p>
              <div className="mt-6">
                <Link href="/teachers/reports/new" className="btn-primary inline-block">
                  Create First Report
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            report.type === "WEEKLY"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {report.type}
                        </span>
                        {report.isRead && (
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                            Read by Director
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {report.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        Sent on {new Date(report.createdAt).toLocaleDateString()} at{" "}
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <Link
                      href={`/teachers/reports/${report.id}`}
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
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

