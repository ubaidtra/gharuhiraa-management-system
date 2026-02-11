import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TeachersDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teacher Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/teachers/halaqa" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">My Halaqa</h3>
            <p className="text-gray-500 mt-1">Manage students in your halaqa</p>
          </Link>
          <Link href="/teachers/learning-records" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">Learning Records</h3>
            <p className="text-gray-500 mt-1">Record student progress</p>
          </Link>
          <Link href="/teachers/reports" className="card card-hover">
            <h3 className="text-lg font-semibold text-gray-700">Reports</h3>
            <p className="text-gray-500 mt-1">Submit weekly and monthly reports</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
