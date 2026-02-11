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
import { Teacher } from "@/types/teacher";

export default function TeachersPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; teacher: Teacher | null }>({
    isOpen: false,
    teacher: null,
  });
  const [toggleDialog, setToggleDialog] = useState<{ isOpen: boolean; teacher: Teacher | null }>({
    isOpen: false,
    teacher: null,
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

  const handleToggleStatus = async () => {
    if (!toggleDialog.teacher) return;
    const teacher = toggleDialog.teacher;
    const action = teacher.isActive ? "deactivate" : "activate";

    setActionLoading(teacher.id);
    setToggleDialog({ isOpen: false, teacher: null });
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
        showToast("success", data.message);
      } else {
        showToast("error", data.error || `Failed to ${action} teacher`);
      }
    } catch (error) {
      console.error(`Error ${action}ing teacher:`, error);
      showToast("error", `An error occurred while ${action}ing the teacher`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.teacher) return;
    const teacher = deleteDialog.teacher;

    setActionLoading(teacher.id);
    setDeleteDialog({ isOpen: false, teacher: null });
    try {
      const res = await fetch(`/api/teachers/${teacher.id}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setTeachers(teachers.filter((t) => t.id !== teacher.id));
        showToast("success", data.message);
      } else {
        showToast("error", data.error || "Failed to delete teacher");
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      showToast("error", "An error occurred while deleting the teacher");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || status === "loading") {
    return <LoadingPage message="Loading teachers..." />;
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
                    <td>{teacher.halaqas?.length || 0}</td>
                    <td>
                      {teacher.halaqas?.reduce(
                        (sum: number, h: any) => sum + h.students.length,
                        0
                      ) || 0}
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
                          onClick={() => setToggleDialog({ isOpen: true, teacher })}
                          disabled={actionLoading === teacher.id}
                          className={`text-sm px-2 py-1 rounded ${
                            teacher.isActive
                              ? "text-orange-600 hover:text-orange-800"
                              : "text-green-600 hover:text-green-800"
                          } disabled:opacity-50 flex items-center gap-1`}
                        >
                          {actionLoading === teacher.id ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Processing...
                            </>
                          ) : teacher.isActive ? (
                            "Deactivate"
                          ) : (
                            "Activate"
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, teacher })}
                          disabled={actionLoading === teacher.id}
                          className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 flex items-center gap-1"
                        >
                          {actionLoading === teacher.id ? (
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
          {filteredTeachers.length === 0 && (
            <EmptyState
              title="No teachers found"
              message={searchTerm ? `No teachers match "${searchTerm}"` : "Get started by adding your first teacher"}
              actionLabel={searchTerm ? undefined : "Add New Teacher"}
              onAction={searchTerm ? undefined : () => window.location.href = "/accounts/teachers/new"}
            />
          )}
        </div>

        <ConfirmDialog
          isOpen={toggleDialog.isOpen}
          title={`${toggleDialog.teacher?.isActive ? "Deactivate" : "Activate"} Teacher`}
          message={`Are you sure you want to ${toggleDialog.teacher?.isActive ? "deactivate" : "activate"} ${toggleDialog.teacher?.firstName} ${toggleDialog.teacher?.lastName}?`}
          confirmText={toggleDialog.teacher?.isActive ? "Deactivate" : "Activate"}
          variant={toggleDialog.teacher?.isActive ? "warning" : "info"}
          onConfirm={handleToggleStatus}
          onCancel={() => setToggleDialog({ isOpen: false, teacher: null })}
        />

        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          title="Delete Teacher"
          message={`⚠️ WARNING: Are you sure you want to PERMANENTLY DELETE ${deleteDialog.teacher?.firstName} ${deleteDialog.teacher?.lastName}?\n\nThis will delete:\n• Teacher record\n• All learning records created by this teacher\n• All reports submitted\n• Remove from assigned halaqas\n\nThis action CANNOT be undone!`}
          confirmText="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteDialog({ isOpen: false, teacher: null })}
        />
      </div>
    </div>
  );
}

