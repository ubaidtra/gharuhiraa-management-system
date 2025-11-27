"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { getRoleDisplayName } from "@/lib/roleDisplay";

export default function Navbar() {
  const { data: session } = useSession();

  const getHomeLink = () => {
    if (!session) return "/";
    switch (session.user.role) {
      case "ACCOUNTS":
        return "/accounts";
      case "TEACHER":
        return "/teachers";
      case "MANAGEMENT":
        return "/management";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href={getHomeLink()} className="flex items-center space-x-3">
              <img 
                src="/logo.jpg" 
                alt="Gharu Hiraa Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold">Gharu Hiraa</span>
            </Link>
            {session && (
              <div className="hidden md:flex space-x-4">
                {session.user.role === "ACCOUNTS" && (
                  <>
                    <Link href="/accounts" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link href="/accounts/students" className="hover:text-blue-200">
                      Students
                    </Link>
                    <Link href="/accounts/teachers" className="hover:text-blue-200">
                      Teachers
                    </Link>
                    <Link href="/accounts/halaqas" className="hover:text-blue-200">
                      Halaqas
                    </Link>
                    <Link href="/accounts/transactions" className="hover:text-blue-200">
                      Payments
                    </Link>
                    <Link href="/accounts/withdrawals" className="hover:text-blue-200">
                      Withdrawals
                    </Link>
                  </>
                )}
                {session.user.role === "TEACHER" && (
                  <>
                    <Link href="/teachers" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link href="/teachers/halaqa" className="hover:text-blue-200">
                      My Halaqa
                    </Link>
                    <Link href="/teachers/learning-records" className="hover:text-blue-200">
                      Learning Records
                    </Link>
                    <Link href="/teachers/reports" className="hover:text-blue-200">
                      Reports
                    </Link>
                  </>
                )}
                {session.user.role === "MANAGEMENT" && (
                  <>
                    <Link href="/management" className="hover:text-blue-200">
                      Dashboard
                    </Link>
                    <Link href="/management/students" className="hover:text-blue-200">
                      Students
                    </Link>
                    <Link href="/management/teachers" className="hover:text-blue-200">
                      Teachers
                    </Link>
                    <Link href="/management/reports" className="hover:text-blue-200">
                      Reports
                    </Link>
                    <Link href="/management/statistics" className="hover:text-blue-200">
                      Statistics
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-sm">
                  {session.user.name} ({getRoleDisplayName(session.user.role)})
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

