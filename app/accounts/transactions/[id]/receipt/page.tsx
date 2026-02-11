"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import { TRANSACTION_TYPE_LABELS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/format";

export default function ReceiptPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const id = params.id as string;
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (session?.user.role !== "ACCOUNTS") redirect("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user.role === "ACCOUNTS" && id) {
      fetch(`/api/transactions/${id}`)
        .then((r) => r.json())
        .then(setTransaction)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [session, id]);

  const handlePrint = () => window.print();

  if (loading || status === "loading") return <LoadingPage message="Loading receipt..." />;
  if (!transaction || transaction.type === "WITHDRAWAL") return <div className="p-8 text-center text-gray-500">Receipt not found</div>;

  const student = transaction.Student || transaction.student;

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white">
      <div className="max-w-lg mx-auto px-4 print:max-w-none print:px-0">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link href="/accounts/transactions" className="text-blue-600 hover:text-blue-800 text-sm">Back to Payments</Link>
          <button onClick={handlePrint} className="btn-primary">Print</button>
        </div>
        <div id="receipt" className="card p-8 bg-white print:shadow-none">
          <h2 className="text-2xl font-bold text-center mb-6">Payment Receipt</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span>{new Date(transaction.date).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Type</span><span>{TRANSACTION_TYPE_LABELS[transaction.type] || transaction.type}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold">{formatCurrency(Number(transaction.amount))}</span></div>
            {student && <div className="flex justify-between"><span className="text-gray-500">Student</span><span>{student.studentId} - {student.firstName} {student.lastName}</span></div>}
            {transaction.description && <div className="flex justify-between"><span className="text-gray-500">Description</span><span>{transaction.description}</span></div>}
            {transaction.photoUrl && <div className="mt-4"><img src={transaction.photoUrl} alt="Receipt" className="max-w-full h-auto max-h-48 rounded print:max-h-96" /></div>}
          </div>
          <p className="text-xs text-gray-400 text-center mt-8">Cave of Hiraa Management System</p>
        </div>
      </div>
    </div>
  );
}
