"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Transaction {
  id: string;
  date: string;
  invoiceNo: string;
  refNo: string;
  buyerName: string;
  country: string;
  airwayBill: string;
  logistics: string;
  sbRef: string;
  value: string;
  payment: string;
  paymentStatus: 'captured' | 'pending' | 'failed';
}

interface Pagination {
  totalTransactions: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

interface Summary {
  totalValue: number;
  cancelledValue: number;
}

// Hardcoded data
const HARDCODED_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2024-03-20",
    invoiceNo: "INV-001",
    refNo: "REF-001",
    buyerName: "John Doe",
    country: "USA",
    airwayBill: "AWB-123456",
    logistics: "FedEx",
    sbRef: "SB-001",
    value: "₹ 5,000",
    payment: "Captured",
    paymentStatus: "captured",
  },
  {
    id: "2",
    date: "2024-03-19",
    invoiceNo: "INV-002",
    refNo: "REF-002",
    buyerName: "Jane Smith",
    country: "UK",
    airwayBill: "AWB-123457",
    logistics: "DHL",
    sbRef: "SB-002",
    value: "₹ 7,500",
    payment: "Pending",
    paymentStatus: "pending",
  },
  {
    id: "3",
    date: "2024-03-18",
    invoiceNo: "INV-003",
    refNo: "REF-003",
    buyerName: "Bob Johnson",
    country: "Canada",
    airwayBill: "AWB-123458",
    logistics: "UPS",
    sbRef: "SB-003",
    value: "₹ 3,200",
    payment: "Captured",
    paymentStatus: "captured",
  },
  {
    id: "4",
    date: "2024-03-17",
    invoiceNo: "INV-004",
    refNo: "REF-004",
    buyerName: "Alice Brown",
    country: "Australia",
    airwayBill: "AWB-123459",
    logistics: "TNT",
    sbRef: "SB-004",
    value: "₹ 6,100",
    payment: "Failed",
    paymentStatus: "failed",
  },
  {
    id: "5",
    date: "2024-03-16",
    invoiceNo: "INV-005",
    refNo: "REF-005",
    buyerName: "Charlie Wilson",
    country: "Germany",
    airwayBill: "AWB-123460",
    logistics: "FedEx",
    sbRef: "SB-005",
    value: "₹ 8,900",
    payment: "Captured",
    paymentStatus: "captured",
  },
];

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending' | 'cancelled'>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(HARDCODED_TRANSACTIONS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const transactions = HARDCODED_TRANSACTIONS.slice(startIndex, startIndex + itemsPerPage);

  const pagination: Pagination = {
    totalTransactions: HARDCODED_TRANSACTIONS.length,
    totalPages,
    hasPrev: currentPage > 1,
    hasNext: currentPage < totalPages,
  };

  const summary: Summary = {
    totalValue: 30700,
    cancelledValue: 0,
  };

  const handleTabChange = (tab: 'all' | 'draft' | 'pending' | 'cancelled') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Skeleton loading component
  const TableSkeleton = () => (
    <tbody>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-line">
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2 border-r border-gray-line">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
          <td className="px-3 py-2">
            <div className="h-4 bg-gray-40 rounded animate-pulse"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button className="bg-blue-00 text-white px-4 py-2 rounded hover:bg-blue-10">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Tabs and Actions Section */}
      <div className="flex justify-between items-center mb-4">
        <nav className="flex space-x-6">
          <button
            onClick={() => handleTabChange("all")}
            className={`py-2 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "text-blue-00 border-b-2 border-blue-00"
                : "text-gray-10 hover:text-blue-00"
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => handleTabChange("draft")}
            className={`py-2 text-sm font-medium transition-colors ${
              activeTab === "draft"
                ? "text-blue-00 border-b-2 border-blue-00"
                : "text-gray-10 hover:text-blue-00"
            }`}
          >
            Draft (10)
          </button>
          <button
            onClick={() => handleTabChange("pending")}
            className={`py-2 text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "text-orange-00 border-b-2 border-orange-00"
                : "text-gray-10 hover:text-orange-00"
            }`}
          >
            Pending Shipping Bill (25)
          </button>
          <button
            onClick={() => handleTabChange("cancelled")}
            className={`py-2 text-sm font-medium transition-colors ${
              activeTab === "cancelled"
                ? "text-blue-00 border-b-2 border-blue-00"
                : "text-gray-10 hover:text-blue-00"
            }`}
          >
            Cancelled
          </button>
        </nav>

        <div className="flex gap-2">
          <select className="px-3 py-1.5 text-sm border border-gray-line rounded bg-white text-gray-10 custom-select">
            <option>This Year</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
          <Link
            href="/sales/create"
            className="bg-blue-00 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-10 flex items-center gap-1 transition-colors"
          >
            <span>+</span>Create Invoice
          </Link>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto bg-white rounded-lg border border-gray-line mb-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-40">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Date</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Invoice #</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Ref #</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Buyer Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Country</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Airway Bill</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Logistics</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">SB Ref #</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10 border-r border-gray-line">Value</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-10">Payment</th>
            </tr>
          </thead>
          {loading ? (
            <TableSkeleton />
          ) : (
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-3 py-8 text-center text-gray-10">
                    No sales transactions found for the selected criteria.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-line hover:bg-gray-40 transition-colors">
                    <td className="px-3 py-2 border-r border-gray-line">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-3 py-2 text-gray-10 border-r border-gray-line">{formatDate(transaction.date)}</td>
                    <td className="px-3 py-2 border-r border-gray-line">
                      <Link href={`/sales/invoice/${transaction.id}`} className="text-blue-00 hover:text-blue-10 cursor-pointer font-medium">
                        {transaction.invoiceNo}
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-gray-10 border-r border-gray-line">{transaction.refNo}</td>
                    <td className="px-3 py-2 text-gray-10 border-r border-gray-line">{transaction.buyerName}</td>
                    <td className="px-3 py-2 text-gray-10 border-r border-gray-line">{transaction.country}</td>
                    <td className="px-3 py-2 text-blue-00 border-r border-gray-line font-medium">{transaction.airwayBill}</td>
                    <td className="px-3 py-2 text-gray-10 border-r border-gray-line">{transaction.logistics}</td>
                    <td className="px-3 py-2 text-gray-10 border-r border-gray-line">{transaction.sbRef}</td>
                    <td className="px-3 py-2 text-gray-10 font-medium border-r border-gray-line">{transaction.value}</td>
                    <td className="px-3 py-2 text-gray-10">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          transaction.paymentStatus === 'captured'
                            ? 'bg-green-20 text-green-30'
                            : transaction.paymentStatus === 'pending'
                            ? 'bg-blue-40 text-blue-00'
                            : 'bg-blue-40 text-blue-00'
                        }`}
                      >
                        {transaction.payment}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Summary Cards */}
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-full border border-green-20 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-10 font-medium">Total</span>
              <span className="text-lg font-semibold text-green-10">₹ {summary?.totalValue?.toLocaleString() || '0'}</span>
            </div>
          </div>
          <div className="px-4 py-2 rounded-full border border-gray-line shadow-sm bg-white">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-10 font-medium">Cancelled</span>
              <span className="text-lg font-semibold text-gray-10">₹ {summary?.cancelledValue?.toLocaleString() || '0'}</span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className="px-3 py-1 text-sm text-gray-10 bg-white border border-gray-line rounded hover:bg-gray-40 disabled:opacity-50 transition-colors"
              disabled={!pagination.hasPrev}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 text-sm rounded transition-colors ${
                    currentPage === page
                      ? "bg-blue-00 text-white"
                      : "text-gray-10 bg-white border border-gray-line hover:bg-gray-40"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, currentPage + 1))}
              className="px-3 py-1 text-sm text-gray-10 bg-white border border-gray-line rounded hover:bg-gray-40 disabled:opacity-50 transition-colors"
              disabled={!pagination.hasNext}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}