"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import accountsService from "@/lib/services/accountsService";
import TableSkeleton from "@/app/components/common/TableSkeleton";

interface PurchaseTransaction {
  id: string;
  orderId: string;
  shipmentId: string;
  date: string;
  invoiceNo: string;
  sellerName: string;
  sellerEmail: string;
  sellerGstin: string;
  buyerName: string;
  buyerEmail: string;
  country: string;
  countryCode: string;
  airwayBill: string;
  purchaseValue: string;
  paymentMethod: string;
  status: string;
  paymentStatus: string;
  invoiceDate?: string;
  orderItems?: any[];
}

export default function PurchasePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [purchaseData, setPurchaseData] = useState<PurchaseTransaction[]>([]);

  useEffect(() => {
    fetchPurchaseData();
  }, [currentPage, activeTab, dateRange]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
    } else {
      const allRows = new Set(purchaseData.map((_, index) => index));
      setSelectedRows(allRows);
      setSelectAll(true);
    }
  };

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === purchaseData.length);
  };

  const fetchPurchaseData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const response = await accountsService.getPurchaseTransactions({
        page: currentPage,
        limit: 10,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
      });

      if (response.success && response.data.transactions) {
        setPurchaseData(response.data.transactions);
      } else {
        setPurchaseData([]);
        setError(response.message || "No purchase data found");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load purchase data");
      setPurchaseData([]);
    } finally {
      setInitialLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Purchase Transactions</h1>
            <p className="text-sm text-gray-500">Manage your purchase transactions</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white text-gray-700"
              onChange={(e) => {
                const value = e.target.value;
                const today = new Date();
                let startDate = "";
                let endDate = today.toISOString().split("T")[0];

                if (value === "thisMonth") {
                  startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
                } else if (value === "lastMonth") {
                  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                  startDate = lastMonth.toISOString().split("T")[0];
                  endDate = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split("T")[0];
                } else if (value === "thisYear") {
                  startDate = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
                }

                setDateRange({ startDate, endDate });
                setCurrentPage(1);
              }}
            >
              <option value="thisYear">This Year</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
            </select>
            <Link 
              href="/purchases/create" 
              className="bg-blue-900 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-800 flex items-center gap-1"
            >
              <span>+</span>
              Create Purchase
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs and Controls Section */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center">
        <nav className="flex space-x-8">
          <button
            onClick={() => { setActiveTab("all"); setCurrentPage(1); }}
            className={`py-2 text-sm font-medium ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Transactions
          </button>
          <button
            onClick={() => { setActiveTab("draft"); setCurrentPage(1); }}
            className={`py-2 text-sm font-medium ${
              activeTab === "draft"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => { setActiveTab("cancelled"); setCurrentPage(1); }}
            className={`py-2 text-sm font-medium ${
              activeTab === "cancelled"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Cancelled
          </button>
        </nav>
      </div>

      {/* Loading State - only show on initial load */}
      {initialLoading && (
        <TableSkeleton rows={10} columns={7} />
      )}

      {/* Error State */}
      {error && !initialLoading && (
        <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchPurchaseData}
            className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Purchase Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Invoice #</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Seller Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Value</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900">Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseData.map((purchase, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
                  <td className="px-4 py-3 text-gray-900">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(index)}
                      onChange={() => handleSelectRow(index)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    {new Date(purchase.date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/purchases/bill/${purchase.id}`} className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium">
                      {purchase.invoiceNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{purchase.orderId}</td>
                  <td className="px-4 py-3 text-gray-900">{purchase.sellerName}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{purchase.purchaseValue}</td>
                  <td className="px-4 py-3 text-gray-900">{purchase.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          {/* Summary Cards */}
          <div className="flex gap-4">
            <div className="bg-green-100 px-6 py-2 rounded-lg border-2 border-green-600">
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-600 font-medium">Total</span>
                <span className="text-base font-semibold text-green-600">
                  {purchaseData.length > 0 
                    ? purchaseData.reduce((sum, p) => {
                        const value = parseFloat(p.purchaseValue.replace(/[^\d.]/g, '') || '0');
                        return sum + value;
                      }, 0).toFixed(2)
                    : '0.00'
                  }
                </span>
              </div>
            </div>
            <div className="bg-red-100 px-6 py-2 rounded-lg border-2 border-red-600">
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600 font-medium">Cancelled</span>
                <span className="text-base font-semibold text-red-600">₹ 0.00</span>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-sm rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
              className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              disabled={currentPage === 5}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
