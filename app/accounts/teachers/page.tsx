"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function TeachersPage() {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState<any[]>([]);
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

    if (session?.user.role === "ACCOUNTS") {
      fetchTeachers();
    }
  }, [session]);

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.teacherId} ${teacher.firstName} ${teacher.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (teacher: any) => {
    const action = teacher.isActive ? "deactivate" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${teacher.firstName} ${teacher.lastName}?`)) {
      return;
    }

    setActionLoading(teacher.id);
    try {
      const res = await fetch(`/api/teachers/${teacher.id}/toggle-status`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setTeachers(
          teachers.map((t) =>
            t.id === teacher.id ? { ...t, isActive: !t.isActive } : t
          )
        );
        alert(data.message);
      } else {
        alert(data.error || `Failed to ${action} teacher`);
      }
    } catch (error) {
      console.error(`Error ${action}ing teacher:`, error);
      alert(`An error occurred while ${action}ing the teacher`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (teacher: any) => {
    if (
      !confirm(
        `⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE ${teacher.firstName} ${teacher.lastName}?\n\nThis will delete:\n• Teacher record\n• All learning records created by this teacher\n• All reports submitted\n• Remove from assigned halaqas\n\nThis action CANNOT be undone!`
      )
    ) {
      return;
    }

    // Double confirmation
    if (
      !confirm(
        `⚠️ FINAL CONFIRMATION\n\nType the teacher's name to confirm deletion:\n${teacher.firstName} ${teacher.lastName}\n\nAre you absolutely sure?`
      )
    ) {
      return;
    }

    setActionLoading(teacher.id);
    try {
      const res = await fetch(`/api/teachers/${teacher.id}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setTeachers(teachers.filter((t) => t.id !== teacher.id));
        alert(data.message);
      } else {
        alert(data.error || "Failed to delete teacher");
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("An error occurred while deleting the teacher");
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
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <Link href="/accounts/teachers/new" className="btn-primary">
            Add New Teacher
          </Link>
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
                  <th>Teacher ID</th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Employment Type</th>
                  <th>Halaqas</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold text-green-600">
                        {teacher.teacherId}
                      </span>
                    </td>
                    <td>
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td>{teacher.gender}</td>
                    <td>{teacher.employmentType.replace(/_/g, " ")}</td>
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
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(teacher)}
                          disabled={actionLoading === teacher.id}
                          className={`text-sm px-2 py-1 rounded ${
                            teacher.isActive
                              ? "text-orange-600 hover:text-orange-800"
                              : "text-green-600 hover:text-green-800"
                          } disabled:opacity-50`}
                        >
                          {actionLoading === teacher.id
                            ? "..."
                            : teacher.isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(teacher)}
                          disabled={actionLoading === teacher.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                        >
                          {actionLoading === teacher.id ? "..." : "Delete"}
                        </button>
                      </div>
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

