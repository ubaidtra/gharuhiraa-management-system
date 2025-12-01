"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
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

    if (session?.user.role === "ACCOUNTS") {
      fetchStudents();
    }
  }, [session]);

  const filteredStudents = students.filter((student) =>
    `${student.studentId} ${student.firstName} ${student.fatherName} ${student.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (student: any) => {
    const action = student.isActive ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${student.firstName} ${student.lastName}?`)) {
      return;
    }

    setActionLoading(student.id);
    try {
      const res = await fetch(`/api/students/${student.id}/toggle-status`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setStudents(
          students.map((s) =>
            s.id === student.id ? { ...s, isActive: !s.isActive } : s
          )
        );
        alert(data.message);
      } else {
        alert(data.error || `Failed to ${action} student`);
      }
    } catch (error) {
      console.error(`Error ${action}ing student:`, error);
      alert(`An error occurred while ${action}ing the student`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (student: any) => {
    if (
      !confirm(
        `⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE ${student.firstName} ${student.lastName}?\n\nThis will delete:\n• Student record\n• All payment history\n• All learning records\n\nThis action CANNOT be undone!`
      )
    ) {
      return;
    }

    // Double confirmation
    if (
      !confirm(
        `⚠️ FINAL CONFIRMATION\n\nType the student's name to confirm deletion:\n${student.firstName} ${student.lastName}\n\nAre you absolutely sure?`
      )
    ) {
      return;
    }

    setActionLoading(student.id);
    try {
      const res = await fetch(`/api/students/${student.id}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setStudents(students.filter((s) => s.id !== student.id));
        alert(data.message);
      } else {
        alert(data.error || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("An error occurred while deleting the student");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <Link href="/accounts/students/new" className="btn-primary">
            Register New Student
          </Link>
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
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                  <th>Halaqa</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold text-blue-600">
                        {student.studentId}
                      </span>
                    </td>
                    <td>
                      {student.firstName} {student.fatherName} {student.lastName}
                    </td>
                    <td>{student.gender}</td>
                    <td>{new Date(student.dob).toLocaleDateString()}</td>
                    <td>{student.halaqa?.name || "Not assigned"}</td>
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
                    <td>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/accounts/students/${student.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(student)}
                          disabled={actionLoading === student.id}
                          className={`text-sm px-2 py-1 rounded ${
                            student.isActive
                              ? "text-orange-600 hover:text-orange-800"
                              : "text-green-600 hover:text-green-800"
                          } disabled:opacity-50`}
                        >
                          {actionLoading === student.id
                            ? "..."
                            : student.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(student)}
                          disabled={actionLoading === student.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        >
                          {actionLoading === student.id ? "..." : "Delete"}
                        </button>
                      </div>
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

