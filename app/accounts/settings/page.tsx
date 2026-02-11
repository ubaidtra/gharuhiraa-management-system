import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountsSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ACCOUNTS") redirect("/login");
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        <p className="text-gray-500">Settings - Phase 7</p>
      </div>
    </div>
  );
}
