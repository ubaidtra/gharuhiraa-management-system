"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/Toast";
import { Student } from "@/types/student";

export default function StudentsPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null,
  });
  const [toggleDialog, setToggleDialog] = useState<{ isOpen: boolean; student: Student | null }>({
    isOpen: false,
    student: null,
  });

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

  const handleToggleStatus = async () => {
    if (!toggleDialog.student) return;
    const student = toggleDialog.student;
    const action = student.isActive ? "deactivate" : "activate";

    setActionLoading(student.id);
    setToggleDialog({ isOpen: false, student: null });
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
        showToast("success", data.message);
      } else {
        showToast("error", data.error || `Failed to ${action} student`);
      }
    } catch (error) {
      console.error(`Error ${action}ing student:`, error);
      showToast("error", `An error occurred while ${action}ing the student`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.student) return;
    const student = deleteDialog.student;

    setActionLoading(student.id);
    setDeleteDialog({ isOpen: false, student: null });
    try {
      const res = await fetch(`/api/students/${student.id}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setStudents(students.filter((s) => s.id !== student.id));
        showToast("success", data.message);
      } else {
        showToast("error", data.error || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      showToast("error", "An error occurred while deleting the student");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || status === "loading") {
    return <LoadingPage message="Loading students..." />;
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
                          onClick={() => setToggleDialog({ isOpen: true, student })}
                          disabled={actionLoading === student.id}
                          className={`text-sm px-2 py-1 rounded ${
                            student.isActive
                              ? "text-orange-600 hover:text-orange-800"
                              : "text-green-600 hover:text-green-800"
                          } disabled:opacity-50 flex items-center gap-1`}
                        >
                          {actionLoading === student.id ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Processing...
                            </>
                          ) : student.isActive ? (
                            "Deactivate"
                          ) : (
                            "Activate"
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, student })}
                          disabled={actionLoading === student.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading === student.id ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredStudents.length === 0 && (
            <EmptyState
              title="No students found"
              message={searchTerm ? `No students match "${searchTerm}"` : "Get started by registering your first student"}
              actionLabel={searchTerm ? undefined : "Register New Student"}
              onAction={searchTerm ? undefined : () => window.location.href = "/accounts/students/new"}
            />
          )}
        </div>

        <ConfirmDialog
          isOpen={toggleDialog.isOpen}
          title={`${toggleDialog.student?.isActive ? "Deactivate" : "Activate"} Student`}
          message={`Are you sure you want to ${toggleDialog.student?.isActive ? "deactivate" : "activate"} ${toggleDialog.student?.firstName} ${toggleDialog.student?.lastName}?`}
          confirmText={toggleDialog.student?.isActive ? "Deactivate" : "Activate"}
          variant={toggleDialog.student?.isActive ? "warning" : "info"}
          onConfirm={handleToggleStatus}
          onCancel={() => setToggleDialog({ isOpen: false, student: null })}
        />

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Student"
          message={`⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE ${deleteDialog.student?.firstName} ${deleteDialog.student?.lastName}?\n\nThis will delete:\n• Student record\n• All payment history\n• All learning records\n\nThis action CANNOT be undone!`}
          confirmText="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialog({ isOpen: false, student: null })}
        />
      </div>
    </div>
  );
}

