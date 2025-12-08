"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";

export default function ViewReportPage() {
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
    if (session?.user.role !== "TEACHER") {
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

    if (session?.user.role === "TEACHER" && reportId) {
      fetchReport();
    }
  }, [session, reportId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this report?")) {
      return;
    }

    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Report deleted successfully");
        router.push("/teachers/reports");
      } else {
        alert("Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("An error occurred");
    }
  };

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
            ← Back to Reports
          </button>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
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
                    Read by Director
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete Report
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Submitted by:</p>
                <p className="font-semibold text-gray-900">
                  {report.teacher.firstName} {report.teacher.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Submitted on:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString()} at{" "}
                  {new Date(report.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Content</h2>
            <div className="prose max-w-none">
              <p className="text-gray-800 whitespace-pre-wrap">{report.content}</p>
            </div>
          </div>

          {report.isRead && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                This report has been read by the Director.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

