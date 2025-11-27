"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AccountsHalaqasPage() {
  const { data: session, status } = useSession();
  const [halaqas, setHalaqas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "ACCOUNTS") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchHalaqas = async () => {
      try {
        const res = await fetch("/api/halaqas");
        const data = await res.json();
        setHalaqas(data);
      } catch (error) {
        console.error("Error fetching halaqas:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "ACCOUNTS") {
      fetchHalaqas();
    }
  }, [session]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/halaqas/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHalaqas(halaqas.filter((h) => h.id !== id));
        alert("Halaqa deleted successfully");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to delete halaqa");
      }
    } catch (error) {
      console.error("Error deleting halaqa:", error);
      alert("An error occurred while deleting");
    }
  };

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Halaqas</h1>
          <Link href="/accounts/halaqas/new" className="btn-primary">
            Create New Halaqa
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halaqas.map((halaqa) => (
            <div key={halaqa.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {halaqa.name}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    halaqa.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {halaqa.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                <strong>Teacher:</strong> {halaqa.teacher.firstName} {halaqa.teacher.lastName}
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Level:</span>
                  <span className="font-medium">
                    {halaqa.studentLevel || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Students:</span>
                  <span className="font-medium">{halaqa.students.length}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  href={`/accounts/halaqas/${halaqa.id}`}
                  className="flex-1 text-center btn-primary text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(halaqa.id, halaqa.name)}
                  className="flex-1 btn-danger text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {halaqas.length === 0 && (
          <div className="card text-center">
            <p className="text-gray-500 mb-4">No halaqas have been created yet.</p>
            <Link href="/accounts/halaqas/new" className="btn-primary inline-block">
              Create Your First Halaqa
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

