"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";

export default function NewReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    reportType: "WEEKLY",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "TEACHER") {
      redirect("/");
    }
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Report sent to Director successfully!");
        router.push("/teachers/reports");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to send report");
      }
    } catch (error) {
      console.error("Error sending report:", error);
      alert("An error occurred while sending the report");
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Send Report to Director</h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Report Guidelines
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Weekly reports: Submit at the end of each week</li>
                <li>• Monthly reports: Submit at the end of each month</li>
                <li>• Include student progress, challenges, and achievements</li>
                <li>• Mention any resources or support needed</li>
                <li>• Keep content clear and professional</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type *
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="WEEKLY">Weekly Report</option>
                <option value="MONTHLY">Monthly Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Weekly Report - Week of Nov 25, 2025"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="input-field"
                rows={12}
                placeholder="Write your detailed report here...

Example structure:
- Student Progress: Describe memorization achievements, number of students who completed their daily dars, etc.
- Challenges Faced: Any difficulties or issues encountered during the week/month.
- Achievements: Notable successes or milestones.
- Recommendations: Suggestions for improvement or support needed.
- Next Steps: Plans for the upcoming period."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters. Be detailed and specific.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                Before Submitting
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>✓ Review your report for clarity and completeness</li>
                <li>✓ Check spelling and grammar</li>
                <li>✓ Ensure all important points are covered</li>
                <li>✓ Once sent, the Director will be notified</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || formData.content.length < 50}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Report to Director"}
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

