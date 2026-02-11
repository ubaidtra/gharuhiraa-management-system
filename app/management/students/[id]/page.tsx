"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import { formatCurrency } from "@/lib/utils/format";

export default function ManagementStudentDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "MANAGEMENT") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "MANAGEMENT" && id) {
      fetch(`/api/students/${id}`).then((r) => r.json()).then(setStudent).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, id]);

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;
  if (!student) return <div className="p-8 text-center text-gray-500">Student not found</div>;

  const halaqa = student.halaqa || student.Halaqa;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/management/students" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Students</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{student.studentId} - {student.firstName} {student.lastName}</h1>
        <div className="card grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div><p className="text-sm text-gray-500">Gender</p><p>{student.gender}</p></div>
          <div><p className="text-sm text-gray-500">DOB</p><p>{new Date(student.dob).toLocaleDateString()}</p></div>
          <div><p className="text-sm text-gray-500">Halaqa</p><p>{halaqa?.name || "Not assigned"}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><p className={student.isActive !== false ? "text-green-600" : "text-red-600"}>{student.isActive !== false ? "Active" : "Inactive"}</p></div>
          <div className="col-span-2"><p className="text-sm text-gray-500">Address</p><p>{student.address}</p></div>
          <div><p className="text-sm text-gray-500">Phone</p><p>{student.phone || "-"}</p></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {(student.transactions || []).length === 0 ? <p className="text-gray-500 text-sm">No transactions</p> : (
              <div className="space-y-2">
                {(student.transactions || []).slice(0, 5).map((t: any) => (
                  <div key={t.id} className="flex justify-between text-sm">
                    <span>{t.type} - {new Date(t.date).toLocaleDateString()}</span>
                    <span className="font-medium">{formatCurrency(Number(t.amount))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Learning Records</h3>
            {(student.learningRecords || []).length === 0 ? <p className="text-gray-500 text-sm">No records</p> : (
              <div className="space-y-2">
                {(student.learningRecords || []).slice(0, 5).map((r: any) => (
                  <div key={r.id} className="text-sm">
                    Week {new Date(r.weekStartDate).toLocaleDateString()} - Attend: {r.attendance}, Mem: {r.memorizedDays}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
