"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function HalaqaPage() {
  const { data: session, status } = useSession();
  const [halaqas, setHalaqas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "TEACHER") {
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

    if (session?.user.role === "TEACHER") {
      fetchHalaqas();
    }
  }, [session]);

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Halaqas</h1>
          <p className="text-gray-600">
            Manage students in your assigned Halaqas. Contact Accounts to create new Halaqas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halaqas.map((halaqa) => (
            <div key={halaqa.id} className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {halaqa.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Teacher: {halaqa.teacher.firstName} {halaqa.teacher.lastName}
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Level:</span>
                  <span className="font-medium">
                    {halaqa.studentLevel || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Students:</span>
                  <span className="font-medium">{halaqa.students.length}</span>
                </div>
              </div>
              <Link
                href={`/teachers/halaqa/${halaqa.id}`}
                className="block text-center btn-primary"
              >
                Manage Students
              </Link>
            </div>
          ))}
        </div>

        {halaqas.length === 0 && (
          <div className="card text-center">
            <p className="text-gray-500 mb-4">You have not been assigned to any halaqas yet.</p>
            <p className="text-sm text-gray-600">
              Please contact the Accounts and Admin department to be assigned to a Halaqa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

