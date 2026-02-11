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
import { GENDER_LABELS } from "@/lib/constants";

export default function NewStudentPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    lastName: "",
    dob: "",
    address: "",
    gender: "MALE",
    phone: "",
    guardianPhone: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        showToast("success", "Student registered successfully");
        router.push("/accounts/students");
      } else {
        const data = await res.json();
        showToast("error", data.error || "Failed to create student");
      }
    } catch {
      showToast("error", "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <LoadingPage message="Loading form..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Register New Student</h1>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="First Name" name="firstName" required>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
              <FormField label="Father Name" name="fatherName" required>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
              <FormField label="Last Name" name="lastName" required>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Date of Birth" name="dob" required>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
              <FormSelect
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                options={Object.entries(GENDER_LABELS).map(([k, v]) => ({ value: k, label: v }))}
              />
            </div>
            <FormTextarea label="Address" name="address" value={formData.address} onChange={handleChange} required rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Student Phone" name="phone">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" disabled={loading} />
              </FormField>
              <FormField label="Guardian Phone" name="guardianPhone">
                <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} className="input-field" disabled={loading} />
              </FormField>
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><LoadingSpinner size="sm" /> Saving...</> : "Register Student"}
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
