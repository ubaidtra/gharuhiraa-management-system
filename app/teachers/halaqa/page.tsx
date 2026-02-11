"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import EmptyState from "@/components/EmptyState";

export default function TeacherHalaqasPage() {
  const { data: session, status } = useSession();
  const [halaqas, setHalaqas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "TEACHER") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "TEACHER") {
      fetch("/api/halaqas").then((r) => r.json()).then(setHalaqas).catch(console.error).finally(() => setLoading(false));
    }
  }, [session]);

  if (loading || status === "loading") return <LoadingPage message="Loading halaqas..." />;

  const students = (h: any) => h.Student || h.students || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Halaqas</h1>
        {halaqas.length === 0 ? (
          <EmptyState title="No halaqas assigned" message="Contact accounts to get assigned to a halaqa." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {halaqas.map((h) => (
              <Link key={h.id} href={`/teachers/halaqa/${h.id}`} className="card card-hover block">
                <h3 className="text-lg font-semibold">{h.name}</h3>
                <p className="text-gray-500 mt-1">{students(h).length} students</p>
                {h.studentLevel && <p className="text-sm text-gray-400 mt-1">Level: {h.studentLevel}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
