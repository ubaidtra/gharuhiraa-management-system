"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";

export default function ManagementReportDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "MANAGEMENT" && id) {
      fetch(`/api/reports/${id}`).then((r) => r.json()).then(setReport).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, id]);

  if (loading || status === "loading") return <LoadingPage message="Loading report..." />;
  if (!report) return <div className="p-8 text-center text-gray-500">Report not found</div>;

  const teacher = report.Teacher || report.teacher;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/management/reports" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Reports</Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
          <p className="text-gray-500 mt-1">{new Date(report.createdAt).toLocaleString()} | {report.type} | {teacher ? `${teacher.firstName} ${teacher.lastName}` : "-"}</p>
        </div>
        <div className="card prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-700">{report.content}</pre>
        </div>
      </div>
    </div>
  );
}
