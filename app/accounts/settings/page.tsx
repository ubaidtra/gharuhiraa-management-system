import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { supabase, RECEIPT_UPLOAD_BUCKET } from "@/lib/supabase";

export default async function AccountsSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ACCOUNTS") redirect("/login");

  const [{ count: userCount }, { count: teacherCount }, { data: bucket }] = await Promise.all([
    supabase.from("User").select("*", { count: "exact", head: true }),
    supabase.from("Teacher").select("*", { count: "exact", head: true }),
    supabase.storage.getBucket(RECEIPT_UPLOAD_BUCKET),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Password & Security</h2>
            <p className="text-sm text-gray-500 mb-6">Update your password without leaving the system.</p>
            <ChangePasswordForm />
          </div>
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Operations</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Users</span>
                  <span className="font-medium">{userCount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Teacher profiles</span>
                  <span className="font-medium">{teacherCount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Receipt storage</span>
                  <span className="font-medium">{bucket ? "Ready" : "Will auto-create"}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
              <div className="flex flex-col gap-3 text-sm">
                <Link href="/accounts/user-management" className="text-blue-600 hover:text-blue-800">Manage users and teacher links</Link>
                <Link href="/accounts/teachers" className="text-blue-600 hover:text-blue-800">Review teacher profiles</Link>
                <Link href="/accounts/withdrawals" className="text-blue-600 hover:text-blue-800">Audit recent withdrawals</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
