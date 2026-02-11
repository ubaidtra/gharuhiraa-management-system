"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";

export default function NewWithdrawalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    photoUrl: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
      redirect("/");
    }
  }, [session, status]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload an image file (JPEG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, photoUrl: data.url });
        alert("Check photo uploaded successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setFormData({ ...formData, photoUrl: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload file first if selected but not uploaded yet
    if (selectedFile && !formData.photoUrl) {
      await handleUpload();
    }

    setLoading(true);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "WITHDRAWAL",
          amount: formData.amount,
          description: formData.description,
          studentId: null,
          photoUrl: formData.photoUrl || null,
          date: formData.date,
        }),
      });

      if (res.ok) {
        router.push("/accounts/withdrawals");
      } else {
        alert("Failed to record withdrawal");
      }
    } catch (error) {
      console.error("Error recording withdrawal:", error);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Record Withdrawal</h1>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-900 mb-2">
                Recording a Withdrawal (Expense)
              </h3>
              <p className="text-sm text-red-800">
                Withdrawals are general expenses or payments made from the school funds 
                (salaries, supplies, rent, utilities, etc.). This is NOT related to specific 
                students or teachers - those are tracked separately.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount * (GMD)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="input-field"
                step="0.01"
                min="0"
                placeholder="Enter withdrawal amount"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Category / Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows={4}
                placeholder="Enter the expense category and details (e.g., Teacher Salaries - January, Office Supplies - Paper and Pens, Rent Payment - Main Building, Utility Bills - Electricity)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what this expense is for
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Photo (Optional)
              </label>
              
              {!previewUrl && !formData.photoUrl && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="check-photo-upload"
                  />
                  <label htmlFor="check-photo-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">Click to upload check photo</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WebP up to 5MB</span>
                    </div>
                  </label>
                </div>
              )}

              {(previewUrl || formData.photoUrl) && (
                <div className="space-y-3">
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl || formData.photoUrl}
                      alt="Check preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    {selectedFile && !formData.photoUrl && (
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="btn-primary flex-1"
                      >
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="btn-secondary"
                    >
                      Remove
                    </button>
                  </div>
                  {formData.photoUrl && (
                    <p className="text-xs text-green-600">Photo uploaded successfully!</p>
                  )}
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Common Expense Categories
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                <div>
                  <strong>Personnel:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Teacher salaries</li>
                    <li>• Staff wages</li>
                    <li>• Benefits</li>
                  </ul>
                </div>
                <div>
                  <strong>Facility:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Rent payment</li>
                    <li>• Utilities (electric, water)</li>
                    <li>• Maintenance</li>
                  </ul>
                </div>
                <div>
                  <strong>Supplies:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Office supplies</li>
                    <li>• Classroom materials</li>
                    <li>• Books and texts</li>
                  </ul>
                </div>
                <div>
                  <strong>Other:</strong>
                  <ul className="ml-4 space-y-1">
                    <li>• Equipment purchase</li>
                    <li>• Insurance</li>
                    <li>• Professional services</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? "Recording..." : "Record Withdrawal"}
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

