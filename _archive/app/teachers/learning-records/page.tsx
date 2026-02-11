"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function LearningRecordsPage() {
  const { data: session, status } = useSession();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterWeek, setFilterWeek] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
    if (session?.user.role !== "TEACHER") {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await fetch("/api/learning-records");
        const data = await res.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching learning records:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === "TEACHER") {
      fetchRecords();
    }
  }, [session]);

  const filteredRecords = filterWeek
    ? records.filter(
        (r) =>
          new Date(r.weekStartDate).toISOString().split("T")[0] === filterWeek
      )
    : records;

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Learning Records</h1>
          <Link href="/teachers/learning-records/new" className="btn-primary">
            Add Weekly Record
          </Link>
        </div>

        <div className="card mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Week Start Date
          </label>
          <input
            type="date"
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>

        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Week Start</th>
                  <th>Student</th>
                  <th>Attendance</th>
                  <th>Surah</th>
                  <th>Memorized</th>
                  <th>Rubu</th>
                  <th>Murajaa</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.weekStartDate).toLocaleDateString()}</td>
                    <td>
                      {record.student.firstName} {record.student.lastName}
                    </td>
                    <td>{record.attendance} days</td>
                    <td>{record.surah || "N/A"}</td>
                    <td>
                      {record.memorizedDays}/{record.memorizedDays + record.notMemorizedDays}
                    </td>
                    <td>{record.rubuAmount}</td>
                    <td>
                      {record.murajaaFrom && record.murajaaTo
                        ? `${record.murajaaFrom} - ${record.murajaaTo}`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRecords.length === 0 && (
          <div className="card text-center mt-6">
            <p className="text-gray-500">No learning records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

