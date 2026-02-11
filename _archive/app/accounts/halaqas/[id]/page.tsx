"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function EditHalaqaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const halaqaId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    studentLevel: "",
    teacherId: "",
    isActive: true,
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
    const fetchData = async () => {
      try {
        const [halaqaRes, teachersRes] = await Promise.all([
          fetch(`/api/halaqas/${halaqaId}`),
          fetch("/api/teachers"),
        ]);

        if (halaqaRes.ok) {
          const halaqa = await halaqaRes.json();
          const teachersData = await teachersRes.json();

          setFormData({
            name: halaqa.name,
            studentLevel: halaqa.studentLevel || "",
            teacherId: halaqa.teacherId,
            isActive: halaqa.isActive,
          });
          setTeachers(teachersData);
        } else {
          alert("Halaqa not found");
          router.push("/accounts/halaqas");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading halaqa");
      } finally {
        setFetchLoading(false);
      }
    };

    if (session?.user.role === "ACCOUNTS" && halaqaId) {
      fetchData();
    }
  }, [session, halaqaId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/halaqas/${halaqaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/accounts/halaqas");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to update halaqa");
      }
    } catch (error) {
      console.error("Error updating halaqa:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "checkbox" 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  if (status === "loading" || fetchLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Halaqa</h1>

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
                Assigned Teacher *
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
                    {teacher.firstName} {teacher.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Halaqa is Active
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Halaqa"}
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

