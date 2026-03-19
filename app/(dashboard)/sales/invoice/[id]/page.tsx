"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceIndex = parseInt(params.id as string) - 1;
  
  const transactionData = [
    {
      date: "21/05/2025",
      invoiceNo: "TTE/25-26/1",
      refNo: "TI/1110",
      buyerName: "Kristina Marfitsyna",
      country: "Russia",
      airwayBill: "RY426034563IN",
      logistics: "IndiaPost",
      sbRef: "525855",
      value: "INR 1,580",
      payment: "RazorPay"
    }
  ];
  
  const selectedTransaction = transactionData[invoiceIndex] || transactionData[0];
  const invoiceId = selectedTransaction.invoiceNo;

  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/sales" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span>←</span>
              <span>Sales/{invoiceId}</span>
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Sales Invoice Details</h1>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600">Invoice: {invoiceId}</p>
      </div>
    </div>
  );
}
