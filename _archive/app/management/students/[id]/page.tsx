"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ManagementStudentDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  
  const [student, setStudent] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [learningRecords, setLearningRecords] = useState<any[]>([]);
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
    const fetchStudentData = async () => {
      try {
        // Fetch student details
        const studentRes = await fetch(`/api/students/${studentId}`);
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          setStudent(studentData);
        }

        // Fetch all transactions for this student
        const transactionsRes = await fetch("/api/transactions");
        if (transactionsRes.ok) {
          const allTransactions = await transactionsRes.json();
          const studentTransactions = allTransactions.filter(
            (t: any) => t.studentId === studentId && t.type !== "WITHDRAWAL"
          );
          setTransactions(studentTransactions);
        }

        // Fetch all learning records for this student
        const learningRes = await fetch("/api/learning-records");
        if (learningRes.ok) {
          const allRecords = await learningRes.json();
          const studentRecords = allRecords.filter(
            (r: any) => r.studentId === studentId
          );
          setLearningRecords(studentRecords);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT" && studentId) {
      fetchStudentData();
    }
  }, [session, studentId]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!student) {
    return <div className="flex justify-center items-center min-h-screen">Student not found</div>;
  }

  // Calculate statistics
  const totalPaid = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalAttendance = learningRecords.reduce((sum, r) => sum + r.attendance, 0);
  const totalMemorizedDays = learningRecords.reduce((sum, r) => sum + r.memorizedDays, 0);
  const totalMurajaaDays = learningRecords.reduce((sum, r) => sum + r.murajaaDays, 0);
  const totalRubu = learningRecords.reduce((sum, r) => sum + r.rubuAmount, 0);
  const averageAttendance = learningRecords.length > 0 ? (totalAttendance / learningRecords.length).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            ← Back to Students
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-sm text-yellow-800 font-medium">
              View Only - You have read-only access to student records
            </p>
          </div>
        </div>

        {/* Student Header */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {student.photo && (
                <img
                  src={student.photo}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {student.firstName} {student.fatherName} {student.lastName}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-mono font-semibold text-blue-600">
                    ID: {student.studentId}
                  </span>
                  <span>•</span>
                  <span>{student.gender}</span>
                  <span>•</span>
                  <span>
                    DOB: {new Date(student.dob).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      student.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {student.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Paid</h3>
            <p className="text-2xl font-bold text-green-600">D{totalPaid.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{transactions.length} transactions</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Rubu</h3>
            <p className="text-2xl font-bold text-purple-600">{totalRubu.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Memorized</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Attendance</h3>
            <p className="text-2xl font-bold text-blue-600">{averageAttendance} days</p>
            <p className="text-xs text-gray-500 mt-1">Per week</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-600 mb-1">Learning Records</h3>
            <p className="text-2xl font-bold text-indigo-600">{learningRecords.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total weeks</p>
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Full Name:</span>
                <p className="font-semibold text-gray-900">
                  {student.firstName} {student.fatherName} {student.lastName}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Date of Birth:</span>
                <p className="font-semibold text-gray-900">
                  {new Date(student.dob).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Gender:</span>
                <p className="font-semibold text-gray-900">{student.gender}</p>
              </div>
              <div>
                <span className="text-gray-600">Address:</span>
                <p className="font-semibold text-gray-900">{student.address}</p>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <p className="font-semibold text-gray-900">{student.phone || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600">Guardian Phone:</span>
                <p className="font-semibold text-gray-900">{student.guardianPhone || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600">Registration Date:</span>
                <p className="font-semibold text-gray-900">
                  {new Date(student.registrationDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Halaqa Information</h2>
            {student.halaqa ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Halaqa Name:</span>
                  <p className="font-semibold text-gray-900">{student.halaqa.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Student Level:</span>
                  <p className="font-semibold text-gray-900">
                    {student.halaqa.studentLevel || "Not specified"}
                  </p>
                </div>
                {student.halaqa.teacher && (
                  <>
                    <div>
                      <span className="text-gray-600">Teacher:</span>
                      <p className="font-semibold text-gray-900">
                        {student.halaqa.teacher.firstName} {student.halaqa.teacher.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Teacher ID:</span>
                      <p className="font-mono font-semibold text-green-600">
                        {student.halaqa.teacher.teacherId}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-gray-600">Halaqa Status:</span>
                  <p className="font-semibold text-gray-900">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        student.halaqa.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.halaqa.isActive ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Not assigned to any Halaqa</p>
            )}
          </div>
        </div>

        {/* Payment Records */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No payment records</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 font-semibold">
                          {transaction.type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="text-green-600 font-semibold">
                        +D{transaction.amount.toFixed(2)}
                      </td>
                      <td>{transaction.description || "-"}</td>
                      <td>
                        <Link
                          href={`/accounts/transactions/${transaction.id}/receipt`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Receipt
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-green-50">
                    <td colSpan={2} className="font-semibold">Total Paid:</td>
                    <td className="font-bold text-green-600">D{totalPaid.toFixed(2)}</td>
                    <td colSpan={2}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Learning Progress Records */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Learning Progress Records</h2>
          {learningRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No learning records yet</p>
          ) : (
            <div className="space-y-4">
              {learningRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Week of {new Date(record.weekStartDate).toLocaleDateString()}
                      </h3>
                      {record.teacher && (
                        <p className="text-sm text-gray-600">
                          Teacher: {record.teacher.firstName} {record.teacher.lastName}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                      {record.attendance} days attended
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    {/* Memorization (Dars) */}
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-purple-900 mb-2">
                        Memorization (Dars)
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Surah:</span>
                          <span className="font-semibold text-gray-900">{record.surah || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Daily Dars:</span>
                          <span className="font-semibold text-gray-900">{record.dailyDars || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Memorized Days:</span>
                          <span className="font-semibold text-green-600">{record.memorizedDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Not Memorized:</span>
                          <span className="font-semibold text-red-600">{record.notMemorizedDays}</span>
                        </div>
                        <div className="flex justify-between border-t pt-1 mt-1">
                          <span className="text-gray-700">Rubu Amount:</span>
                          <span className="font-bold text-purple-600">{record.rubuAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Review (Murajaa) */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-blue-900 mb-2">
                        Review (Murajaa)
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-700">From:</span>
                          <span className="font-semibold text-gray-900">{record.murajaaFrom || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">To:</span>
                          <span className="font-semibold text-gray-900">{record.murajaaTo || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Reviewed Days:</span>
                          <span className="font-semibold text-green-600">{record.murajaaDays}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Not Reviewed:</span>
                          <span className="font-semibold text-red-600">{record.murajaaNotDays}</span>
                        </div>
                      </div>
                    </div>

                    {/* Attendance & Notes */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-gray-900 mb-2">
                        Attendance & Notes
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-700">Days Present:</span>
                          <p className="font-semibold text-blue-600 text-lg">{record.attendance} / 6</p>
                        </div>
                        {record.notes && (
                          <div>
                            <span className="text-gray-700">Notes:</span>
                            <p className="text-gray-900 mt-1 text-xs italic">
                              "{record.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-right mt-2">
                    Recorded: {new Date(record.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overall Progress Summary */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Overall Progress Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Memorization Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Memorized Days:</span>
                  <span className="font-semibold text-green-600">{totalMemorizedDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Rubu Memorized:</span>
                  <span className="font-semibold text-purple-600">{totalRubu.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Success Rate:</span>
                  <span className="font-semibold text-blue-600">
                    {learningRecords.length > 0
                      ? ((totalMemorizedDays / (totalMemorizedDays + learningRecords.reduce((sum, r) => sum + r.notMemorizedDays, 0))) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Review Progress (Murajaa)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Review Days:</span>
                  <span className="font-semibold text-green-600">{totalMurajaaDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Average per Week:</span>
                  <span className="font-semibold text-blue-600">
                    {learningRecords.length > 0 ? (totalMurajaaDays / learningRecords.length).toFixed(1) : 0} days
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Attendance Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Days Attended:</span>
                  <span className="font-semibold text-blue-600">{totalAttendance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Average per Week:</span>
                  <span className="font-semibold text-green-600">{averageAttendance} / 6 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Attendance Rate:</span>
                  <span className="font-semibold text-purple-600">
                    {learningRecords.length > 0
                      ? ((totalAttendance / (learningRecords.length * 6)) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

