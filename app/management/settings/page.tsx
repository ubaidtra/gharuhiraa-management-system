import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { supabase } from "@/lib/supabase";

export default async function ManagementSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MANAGEMENT") redirect("/login");

  const [{ count: unreadReports }, { count: activeStudents }, { count: activeTeachers }] = await Promise.all([
    supabase.from("Report").select("*", { count: "exact", head: true }).eq("isRead", false),
    supabase.from("Student").select("*", { count: "exact", head: true }).eq("isActive", true),
    supabase.from("Teacher").select("*", { count: "exact", head: true }).eq("isActive", true),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Password & Access</h2>
            <p className="text-sm text-gray-500 mb-6">Keep your management account secure.</p>
            <ChangePasswordForm />
          </div>
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Oversight Snapshot</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Unread teacher reports</span>
                  <span className="font-medium">{unreadReports ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active students</span>
                  <span className="font-medium">{activeStudents ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active teachers</span>
                  <span className="font-medium">{activeTeachers ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/management/reports" className="text-blue-600 hover:text-blue-800">Review teacher reports</Link>
                <Link href="/management/statistics" className="text-blue-600 hover:text-blue-800">Open statistics dashboard</Link>
                <Link href="/management/financial-reports" className="text-blue-600 hover:text-blue-800">Open financial reports</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
