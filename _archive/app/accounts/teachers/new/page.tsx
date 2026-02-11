"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import FormTextarea from "@/components/FormTextarea";
import { useToast } from "@/components/Toast";
import { GENDERS, GENDER_LABELS, EMPLOYMENT_TYPES, EMPLOYMENT_TYPE_LABELS } from "@/lib/constants";

export default function NewTeacherPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "MALE",
    certificate: "",
    dob: "",
    address: "",
    phone: "",
    employmentType: "FULL_TIME",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
      redirect("/");
    }
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast("success", "Teacher added successfully");
        router.push("/accounts/teachers");
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to create teacher");
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      showToast("error", "An error occurred while creating the teacher");
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
    return <LoadingPage message="Loading form..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Teacher</h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" name="firstName" required error={errors.firstName}>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? "border-red-500" : ""}`}
                  required
                  disabled={loading}
                />
              </FormField>
              <FormField label="Last Name" name="lastName" required error={errors.lastName}>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? "border-red-500" : ""}`}
                  required
                  disabled={loading}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                options={Object.entries(GENDERS).map(([key, value]) => ({
                  value,
                  label: GENDER_LABELS[value] || value,
                }))}
              />
              <FormField label="Date of Birth" name="dob" required error={errors.dob}>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`input-field ${errors.dob ? "border-red-500" : ""}`}
                  required
                  disabled={loading}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Employment Type"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                required
                options={Object.entries(EMPLOYMENT_TYPES).map(([key, value]) => ({
                  value,
                  label: EMPLOYMENT_TYPE_LABELS[value] || value,
                }))}
              />
              <FormField label="Phone" name="phone" error={errors.phone}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </FormField>
            </div>

            <FormField label="Certificate/Qualification" name="certificate" hint="e.g., Ijazah in Hafs">
              <input
                type="text"
                name="certificate"
                value={formData.certificate}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Ijazah in Hafs"
                disabled={loading}
              />
            </FormField>

            <FormTextarea
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              error={errors.address}
            />

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Add Teacher"
                )}
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

