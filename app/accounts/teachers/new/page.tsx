"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import LoadingSpinner from "@/components/LoadingSpinner";
import FormField from "@/components/FormField";
import FormSelect from "@/components/FormSelect";
import { useToast } from "@/components/Toast";
import { GENDER_LABELS, EMPLOYMENT_TYPE_LABELS } from "@/lib/constants";

export default function NewTeacherPage() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        showToast("error", data.error || "Failed");
      }
    } catch { showToast("error", "An error occurred"); }
    finally { setLoading(false); }
  };

  if (status === "loading") return <LoadingPage message="Loading form..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Teacher</h1>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" name="firstName" required>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
              <FormField label="Last Name" name="lastName" required>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Date of Birth" name="dob" required>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" required disabled={loading} />
              </FormField>
              <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={Object.entries(GENDER_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
            </div>
            <FormField label="Address" name="address" required>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" required disabled={loading} />
            </FormField>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Phone" name="phone">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" disabled={loading} />
              </FormField>
              <FormSelect label="Employment Type" name="employmentType" value={formData.employmentType} onChange={handleChange} options={Object.entries(EMPLOYMENT_TYPE_LABELS).map(([k, v]) => ({ value: k, label: v }))} />
            </div>
            <FormField label="Certificate" name="certificate">
              <input type="text" name="certificate" value={formData.certificate} onChange={handleChange} className="input-field" disabled={loading} placeholder="Optional" />
            </FormField>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                {loading ? <><LoadingSpinner size="sm" /> Saving...</> : "Add Teacher"}
              </button>
              <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
