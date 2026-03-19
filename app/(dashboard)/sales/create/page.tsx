"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CreateInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get('edit') === 'true';
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerMobile: "",
    shippingAddress: {
      line1: "",
      line2: "",
      line3: "",
      line4: ""
    },
    billingAddress: {
      line1: "",
      line2: "",
      line3: "",
      line4: ""
    },
    invoiceDate: "",
    currency: "",
    exchangeRate: "",
    exportType: "",
    payment: "",
    logistics: "",
    awb: "",
    items: [
      { name: "", qty: "", hsn: "", gst: "", rate: "", discount: "", dRate: "", amount: "" }
    ],
    paymentRef: "",
    totalItems: "",
    amountInWords: "",
    taxableAmount: "",
    igst: "",
    total: ""
  });

  useEffect(() => {
    if (editMode) {
      setFormData({
        customerName: "Kristina Marfitsyna",
        customerEmail: "kgmarfitsyna@gmail.com",
        customerMobile: "+1 719 259 3091",
        shippingAddress: {
          line1: "68 Lady Hay Road",
          line2: "Leicester",
          line3: "LE3 9SJ",
          line4: "United Kingdom"
        },
        billingAddress: {
          line1: "1 Kiln Orchard Way",
          line2: "Birstall, Leicester",
          line3: "LE4 3NT",
          line4: "United Kingdom"
        },
        invoiceDate: "21/05/2025",
        currency: "INR",
        exchangeRate: "1",
        exportType: "Export with IGST",
        payment: "RazorPay",
        logistics: "DHL Express",
        awb: "RY426034563IN",
        items: [
          { name: "Himalaya Liv.52 Tablet", qty: "10", hsn: "30049011", gst: "05%", rate: "220.00", discount: "10%", dRate: "198.00", amount: "1980.00" },
          { name: "Baidyanath Prahakarvati 20 Tablet", qty: "5", hsn: "30049011", gst: "12%", rate: "120.00", discount: "10%", dRate: "108.00", amount: "540.00" }
        ],
        paymentRef: "ekjfejkdhkjhkajsdnjkjd587845155kjbkajsb",
        totalItems: "2/15",
        amountInWords: "Two Thousand Five Hundred And Twenty Rupees",
        taxableAmount: "2367.86",
        igst: "2367.86",
        total: "2520.00"
      });
    }
  }, [editMode]);

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", qty: "", hsn: "", gst: "", rate: "", discount: "", dRate: "", amount: "" }]
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving/Updating invoice:", formData);
    router.push("/sales");
  };

  const handleSaveAsDraft = () => {
    console.log("Saving as draft:", formData);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/sales" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span>←</span>
              <span>Sales</span>
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">
            {editMode ? "Edit Invoice" : "Create Invoice"}
          </h1>
          <div className="text-blue-600 font-medium">Order Id # ______</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Name : 
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="ml-2 border-b border-gray-300 focus:border-blue-500 outline-none text-gray-900"
                  placeholder="____________________"
                />
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-xl">📄</span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
            >
              Save As Draft
            </button>
            <button
              type="submit"
              className="bg-green-100 text-green-600 border-2 border-green-600 px-6 py-2 rounded-full text-sm hover:bg-green-200 font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
