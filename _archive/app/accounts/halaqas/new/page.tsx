"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

export default function NewHalaqaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    studentLevel: "",
    teacherId: "",
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
        setTeachers(data.filter((t: any) => t.isActive));
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    if (session?.user.role === "ACCOUNTS") {
      fetchTeachers();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/halaqas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/accounts/halaqas");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create halaqa");
      }
    } catch (error) {
      console.error("Error creating halaqa:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Halaqa</h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Halaqa Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Beginners Group A"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Level
              </label>
              <input
                type="text"
                name="studentLevel"
                value={formData.studentLevel}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Beginner, Intermediate, Advanced"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Teacher *
              </label>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.firstName} {teacher.lastName} ({teacher.employmentType.replace(/_/g, " ")})
                  </option>
                ))}
              </select>
              {teachers.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No teachers available. Please add teachers first.
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                About Halaqas
              </h3>
              <p className="text-sm text-blue-800">
                A Halaqa is a study circle led by a teacher. After creating a halaqa,
                teachers can manage their assigned students and record learning progress.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || teachers.length === 0}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Halaqa"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

