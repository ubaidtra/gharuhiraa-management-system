"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

export default function NewLearningRecordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentId: "",
    teacherId: "",
    weekStartDate: "",
    attendance: "0",
    surah: "",
    dailyDars: "",
    memorizedDays: "0",
    notMemorizedDays: "0",
    rubuAmount: "0",
    murajaaFrom: "",
    murajaaTo: "",
    murajaaDays: "0",
    murajaaNotDays: "0",
    notes: "",
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
        const [studentsRes, teachersRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/teachers"),
        ]);

        const studentsData = await studentsRes.json();
        const teachersData = await teachersRes.json();

        setStudents(studentsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (session?.user.role === "TEACHER") {
      fetchData();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/learning-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/teachers/learning-records");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create learning record");
      }
    } catch (error) {
      console.error("Error creating learning record:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Add Weekly Learning Record
        </h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student *
                </label>
                <select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.fatherName} {student.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher *
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Week Start Date *
                </label>
                <input
                  type="date"
                  name="weekStartDate"
                  value={formData.weekStartDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendance (Days) *
                </label>
                <input
                  type="number"
                  name="attendance"
                  value={formData.attendance}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  max="7"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Memorization (Hifz)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surah
                  </label>
                  <input
                    type="text"
                    name="surah"
                    value={formData.surah}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Al-Baqarah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Dars
                  </label>
                  <input
                    type="text"
                    name="dailyDars"
                    value={formData.dailyDars}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Ayah 1-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memorized Days
                  </label>
                  <input
                    type="number"
                    name="memorizedDays"
                    value={formData.memorizedDays}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Not Memorized Days
                  </label>
                  <input
                    type="number"
                    name="notMemorizedDays"
                    value={formData.notMemorizedDays}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rubu Amount
                  </label>
                  <input
                    type="number"
                    name="rubuAmount"
                    value={formData.rubuAmount}
                    onChange={handleChange}
                    className="input-field"
                    step="0.25"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Review (Murajaa)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Murajaa From
                  </label>
                  <input
                    type="text"
                    name="murajaaFrom"
                    value={formData.murajaaFrom}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Al-Fatihah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Murajaa To
                  </label>
                  <input
                    type="text"
                    name="murajaaTo"
                    value={formData.murajaaTo}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Al-Baqarah"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Murajaa Days (Successful)
                  </label>
                  <input
                    type="number"
                    name="murajaaDays"
                    value={formData.murajaaDays}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Murajaa Days (Unsuccessful)
                  </label>
                  <input
                    type="number"
                    name="murajaaNotDays"
                    value={formData.murajaaNotDays}
                    onChange={handleChange}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Additional observations or comments..."
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Learning Record"}
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

