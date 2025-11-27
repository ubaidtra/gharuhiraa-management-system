"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";

export default function ManageHalaqaPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const halaqaId = params.id as string;

  const [halaqa, setHalaqa] = useState<any>(null);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    studentLevel: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "TEACHER") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [halaqaRes, studentsRes] = await Promise.all([
          fetch(`/api/halaqas/${halaqaId}`),
          fetch("/api/students"),
        ]);

        if (halaqaRes.ok) {
          const halaqaData = await halaqaRes.json();
          const students = await studentsRes.json();

          setHalaqa(halaqaData);
          setEditForm({
            name: halaqaData.name,
            studentLevel: halaqaData.studentLevel || "",
          });
          setAllStudents(students.filter((s: any) => !s.halaqaId));
        } else {
          console.error("Halaqa not found");
          setHalaqa(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setHalaqa(null);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "TEACHER" && halaqaId) {
      fetchData();
    }
  }, [session, halaqaId]);

  const handleAddStudent = async () => {
    if (!selectedStudent) return;

    try {
      const res = await fetch(`/api/halaqas/${halaqaId}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent }),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      alert("An error occurred");
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      const res = await fetch(
        `/api/halaqas/${halaqaId}/students?studentId=${studentId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to remove student");
      }
    } catch (error) {
      console.error("Error removing student:", error);
      alert("An error occurred");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: halaqa.name,
      studentLevel: halaqa.studentLevel || "",
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/halaqas/${halaqaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        alert("Halaqa updated successfully!");
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update halaqa");
      }
    } catch (error) {
      console.error("Error updating halaqa:", error);
      alert("An error occurred");
    }
  };

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!halaqa) {
    return <div className="flex justify-center items-center min-h-screen">Halaqa not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            {!isEditing ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{halaqa.name}</h1>
                <p className="text-gray-600">
                  Level: {halaqa.studentLevel || "Not specified"}
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Halaqa Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field max-w-md"
                    placeholder="e.g., Beginners Group A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Level
                  </label>
                  <input
                    type="text"
                    value={editForm.studentLevel}
                    onChange={(e) => setEditForm({ ...editForm, studentLevel: e.target.value })}
                    className="input-field max-w-md"
                    placeholder="e.g., Beginner, Intermediate, Advanced"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="btn-primary"
              >
                Edit Halaqa Details
              </button>
            ) : (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="btn-primary"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add Student to Halaqa</h2>
            <div className="space-y-4">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="input-field"
              >
                <option value="">Select a student</option>
                {allStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.fatherName} {student.lastName}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddStudent}
                disabled={!selectedStudent}
                className="btn-primary w-full disabled:opacity-50"
              >
                Add Student
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">
              Current Students ({halaqa.students?.length || 0})
            </h2>
            {!halaqa.students || halaqa.students.length === 0 ? (
              <p className="text-gray-500">No students in this halaqa yet.</p>
            ) : (
              <div className="space-y-2">
                {halaqa.students.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>
                      {student.firstName} {student.fatherName} {student.lastName}
                    </span>
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
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

