"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";

export default function TransactionReceiptPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const transactionId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);
  
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`/api/transactions/${transactionId}`);
        if (res.ok) {
          const data = await res.json();
          setTransaction(data);
        } else {
          console.error("Transaction not found");
          setTransaction(null);
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        setTransaction(null);
      } finally {
        setLoading(false);
      }
    };

    if (session && transactionId) {
      fetchTransaction();
    }
  }, [session, transactionId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!transaction) {
    return <div className="flex justify-center items-center min-h-screen">Transaction not found</div>;
  }

  const isWithdrawal = transaction.type === "WITHDRAWAL";

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt,
          #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
        @page {
          margin: 0.5in;
          size: letter;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 py-8 no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {isWithdrawal ? "Expense Receipt" : "Payment Receipt"}
            </h1>
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
          </div>

          {/* Receipt Preview */}
          <div id="printable-receipt" ref={printRef} className="bg-white shadow-lg rounded-lg p-8">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-6 mb-6">
              <div className="flex justify-center mb-3">
                <img 
                  src="/logo.jpg" 
                  alt="Gharu Hiraa Logo" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gharu Hiraa</h1>
              <p className="text-lg text-gray-600">School for Quranic Memorization</p>
              <p className="text-sm text-gray-500 mt-2">
                {isWithdrawal ? "EXPENSE RECEIPT" : "PAYMENT RECEIPT"}
              </p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Receipt Number:</p>
                <p className="font-mono font-semibold text-gray-900">
                  {transaction.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Date:</p>
                <p className="font-semibold text-gray-900">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Student Info (for payments only) */}
            {!isWithdrawal && transaction.student && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-3">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Student ID:</p>
                    <p className="font-mono font-semibold text-blue-900">
                      {transaction.student.studentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Student Name:</p>
                    <p className="font-semibold text-blue-900">
                      {transaction.student.firstName} {transaction.student.fatherName} {transaction.student.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Registration Date:</p>
                    <p className="font-semibold text-blue-900">
                      {new Date(transaction.student.registrationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Details */}
            <div className="border-2 border-gray-300 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-700">Type:</span>
                  <span className={`font-semibold px-3 py-1 rounded ${
                    isWithdrawal 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {transaction.type.replace(/_/g, " ")}
                  </span>
                </div>

                {transaction.description && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700">Description:</span>
                    <span className="font-medium text-gray-900 text-right max-w-md">
                      {transaction.description}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-3 bg-gray-50 rounded px-4 mt-4">
                  <span className="text-lg font-semibold text-gray-900">Amount Paid:</span>
                  <span className={`text-2xl font-bold ${
                    isWithdrawal ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {isWithdrawal ? '-' : '+'}D{transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-300 pt-6 mt-8">
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p className="font-semibold text-gray-900">Thank you for your payment!</p>
                <p>This is an official receipt for your records.</p>
                <p className="text-xs text-gray-500 mt-4">
                  For inquiries, please contact the Accounts and Admin department.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Issued by: {session?.user.username || 'Accounts and Admin'}</span>
                  <span>Date printed: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Print Only - Signature Line */}
            <div className="print-only mt-12 pt-8 border-t-2 border-gray-300">
              <div className="flex justify-between items-end">
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                  <p className="text-sm font-semibold">Received By</p>
                  <p className="text-xs text-gray-600">Signature & Date</p>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-400 w-48 mb-2"></div>
                  <p className="text-sm font-semibold">Authorized By</p>
                  <p className="text-xs text-gray-600">Accounts and Admin Department</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
