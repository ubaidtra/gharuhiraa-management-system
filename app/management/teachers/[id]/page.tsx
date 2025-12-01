"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ManagementTeacherDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const teacherId = params.id as string;
  
  const [teacher, setTeacher] = useState<any>(null);
  const [learningRecords, setLearningRecords] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
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
    const fetchTeacherData = async () => {
      try {
        // Fetch teacher details
        const teacherRes = await fetch(`/api/teachers/${teacherId}`);
        if (teacherRes.ok) {
          const teacherData = await teacherRes.json();
          setTeacher(teacherData);
        }

        // Fetch learning records by this teacher
        const learningRes = await fetch("/api/learning-records");
        if (learningRes.ok) {
          const allRecords = await learningRes.json();
          const teacherRecords = allRecords.filter(
            (r: any) => r.teacherId === teacherId
          );
          setLearningRecords(teacherRecords);
        }

        // Fetch reports by this teacher
        const reportsRes = await fetch("/api/reports");
        if (reportsRes.ok) {
          const allReports = await reportsRes.json();
          const teacherReports = allReports.filter(
            (r: any) => r.teacherId === teacherId
          );
          setReports(teacherReports);
        }
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT" && teacherId) {
      fetchTeacherData();
    }
  }, [session, teacherId]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!teacher) {
    return <div className="flex justify-center items-center min-h-screen">Teacher not found</div>;
  }

  const totalStudents = teacher.halaqas?.reduce((sum: number, h: any) => sum + h.students.length, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            ← Back to Teachers
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-yellow-800 font-medium">
              View Only - You have read-only access to teacher records
            </p>
          </div>
        </div>

        {/* Teacher Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {teacher.photo && (
                <img
                  src={teacher.photo}
                  alt={`${teacher.firstName} ${teacher.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {teacher.firstName} {teacher.lastName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-mono font-semibold text-green-600">
                    ID: {teacher.teacherId}
                  </span>
                  <span>•</span>
                  <span>{teacher.gender}</span>
                  <span>•</span>
                  <span>{teacher.employmentType.replace(/_/g, " ")}</span>
                  <span>•</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      teacher.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {teacher.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Halaqas</h3>
            <p className="text-2xl font-bold text-blue-600">{teacher.halaqas?.length || 0}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Students</h3>
            <p className="text-2xl font-bold text-green-600">{totalStudents}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Learning Records</h3>
            <p className="text-2xl font-bold text-purple-600">{learningRecords.length}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Reports Submitted</h3>
            <p className="text-2xl font-bold text-indigo-600">{reports.length}</p>
          </div>
        </div>

        {/* Teacher Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Full Name:</span>
                <p className="font-semibold text-gray-900">
                  {teacher.firstName} {teacher.lastName}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Date of Birth:</span>
                <p className="font-semibold text-gray-900">
                  {new Date(teacher.dob).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Gender:</span>
                <p className="font-semibold text-gray-900">{teacher.gender}</p>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-semibold text-gray-900">{teacher.address}</p>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-semibold text-gray-900">{teacher.phone || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600">Hire Date:</span>
                <p className="font-semibold text-gray-900">
                  {new Date(teacher.hireDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Employment Type:</span>
                <p className="font-semibold text-gray-900">
                  {teacher.employmentType.replace(/_/g, " ")}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Certificate:</span>
                <p className="font-semibold text-gray-900">{teacher.certificate || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <p className="font-semibold text-gray-900">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      teacher.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {teacher.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Halaqas */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Halaqas</h2>
          {!teacher.halaqas || teacher.halaqas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No halaqas assigned</p>
          ) : (
            <div className="space-y-3">
              {teacher.halaqas.map((halaqa: any) => (
                <div key={halaqa.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{halaqa.name}</h3>
                      <p className="text-sm text-gray-600">
                        Level: {halaqa.studentLevel || "Not specified"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Students: {halaqa.students?.length || 0}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        halaqa.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {halaqa.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {halaqa.students && halaqa.students.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600 mb-2">Students in this Halaqa:</p>
                      <div className="flex flex-wrap gap-2">
                        {halaqa.students.map((student: any) => (
                          <Link
                            key={student.id}
                            href={`/management/students/${student.id}`}
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                          >
                            {student.firstName} {student.lastName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Reports to Director</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reports submitted yet</p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
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
                            Read
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{report.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={`/management/reports/${report.id}`}
                      className="ml-4 text-blue-600 hover:text-blue-800 text-sm whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
              {reports.length > 5 && (
                <Link
                  href="/management/reports"
                  className="block text-center text-blue-600 hover:text-blue-800 text-sm pt-2"
                >
                  View all {reports.length} reports →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

