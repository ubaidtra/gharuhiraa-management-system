"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";

export default function ViewReportPageManagement() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      try {
        const res = await fetch(`/api/reports/${reportId}`);
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        } else {
          console.error("Failed to fetch report");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT" && reportId) {
      fetchReport();
    }
  }, [session, reportId]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!report) {
    return <div className="flex justify-center items-center min-h-screen">Report not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            ← Back to All Reports
          </button>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded ${
                    report.reportType === "WEEKLY"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {report.reportType} REPORT
                </span>
                {report.isRead && (
                  <span className="px-3 py-1 text-sm font-semibold rounded bg-green-100 text-green-800">
                    Read
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Submitted by:</p>
                <p className="font-semibold text-gray-900">
                  {report.teacher.firstName} {report.teacher.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {report.teacher.teacherId}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Report Type:</p>
                <p className="font-semibold text-gray-900">
                  {report.reportType} Report
                </p>
              </div>
              <div>
                <p className="text-gray-600">Submitted on:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(report.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Content</h2>
            <div className="prose max-w-none">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {report.content}
              </p>
            </div>
          </div>

          {!report.isRead && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                This report was automatically marked as read when you opened it.
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Report ID: {report.id.substring(0, 8).toUpperCase()}</span>
              <span>Last updated: {new Date(report.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

