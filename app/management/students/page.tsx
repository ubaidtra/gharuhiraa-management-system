"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function ManagementStudentsPage() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "MANAGEMENT") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/students");
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT") {
      fetchStudents();
    }
  }, [session]);

  const filteredStudents = students.filter((student) =>
    `${student.studentId} ${student.firstName} ${student.fatherName} ${student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students (Read-Only)</h1>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
            View Only
          </span>
        </div>

        <div className="card mb-6">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Halaqa</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      {student.firstName} {student.fatherName} {student.lastName}
                    </td>
                    <td>{student.gender}</td>
                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                    <td>{student.halaqa?.name || "Not assigned"}</td>
                    <td>{new Date(student.registrationDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          student.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

