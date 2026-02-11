"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";

export default function TeacherDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS" && id) {
      fetch(`/api/teachers/${id}`).then((r) => r.json()).then(setTeacher).catch(console.error).finally(() => setLoading(false));
    }
  }, [session, id]);

  if (loading || status === "loading") return <LoadingPage message="Loading..." />;
  if (!teacher) return <div className="p-8 text-center text-gray-500">Teacher not found</div>;

  const halaqas = teacher.halaqas || teacher.Halaqa || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/accounts/teachers" className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block">Back to Teachers</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{teacher.teacherId} - {teacher.firstName} {teacher.lastName}</h1>
        <div className="card grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div><p className="text-sm text-gray-500">Gender</p><p>{teacher.gender}</p></div>
          <div><p className="text-sm text-gray-500">Employment</p><p>{teacher.employmentType?.replace(/_/g, " ")}</p></div>
          <div><p className="text-sm text-gray-500">DOB</p><p>{new Date(teacher.dob).toLocaleDateString()}</p></div>
          <div><p className="text-sm text-gray-500">Status</p><p className={teacher.isActive ? "text-green-600" : "text-red-600"}>{teacher.isActive ? "Active" : "Inactive"}</p></div>
          <div className="col-span-2"><p className="text-sm text-gray-500">Address</p><p>{teacher.address}</p></div>
          <div><p className="text-sm text-gray-500">Phone</p><p>{teacher.phone || "-"}</p></div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Assigned Halaqas</h3>
          {halaqas.length === 0 ? <p className="text-gray-500">No halaqas assigned</p> : (
            <div className="space-y-2">
              {halaqas.map((h: any) => (
                <Link key={h.id} href={`/accounts/halaqas/${h.id}`} className="block border-b pb-2">
                  <span className="font-medium">{h.name}</span>
                  <span className="text-gray-500 ml-2">({(h.students || h.Student || []).length} students)</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
