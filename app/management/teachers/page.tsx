"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function ManagementTeachersPage() {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState<any[]>([]);
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
    const fetchTeachers = async () => {
      try {
        const res = await fetch("/api/teachers");
        const data = await res.json();
        setTeachers(data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "MANAGEMENT") {
      fetchTeachers();
    }
  }, [session]);

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.teacherId} ${teacher.firstName} ${teacher.lastName}`
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
          <h1 className="text-3xl font-bold text-gray-900">Teachers (Read-Only)</h1>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
            View Only
          </span>
        </div>

        <div className="card mb-6">
          <input
            type="text"
            placeholder="Search teachers by ID or name..."
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
                  <th>Employment Type</th>
                  <th>Certificate</th>
                  <th>Halaqas</th>
                  <th>Students</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td>{teacher.gender}</td>
                    <td>{teacher.employmentType.replace(/_/g, " ")}</td>
                    <td>{teacher.certificate || "N/A"}</td>
                    <td>{teacher.halaqas.length}</td>
                    <td>
                      {teacher.halaqas.reduce(
                        (sum: number, h: any) => sum + h.students.length,
                        0
                      )}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          teacher.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {teacher.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

