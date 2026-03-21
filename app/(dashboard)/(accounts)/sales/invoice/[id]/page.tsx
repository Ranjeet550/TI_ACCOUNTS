"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileInvoice, faFileAlt, faFileContract } from "@fortawesome/free-solid-svg-icons";

interface InvoiceDetail {
  id: string;
  invoiceNo: string;
  orderId: string;
  customerName: string;
  email: string;
  mobile: string;
  paymentMethod: string;
  port: string;
  logistics: string;
  awb: string;
  shippingBill: string;
  sbDate: string;
  egm: string;
  invoiceDate: string;
  invoiceCurrency: string;
  exchangeRate: string;
  exportType: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: number;
    name: string;
    qty: number;
    hsn: string;
    gstPercent: number;
    rate: number;
    discount: number;
    discountRate: number;
    amount: number;
  }>;
  paymentRef: string;
  totalItems: number;
  totalQty: number;
  amountInWords: string;
  taxableAmount: number;
  igst: number;
  total: number;
}

// Hardcoded invoice data
const INVOICE_DATA: InvoiceDetail = {
  id: "1",
  invoiceNo: "TTE/25-26/1",
  orderId: "TI/1110",
  customerName: "Kristina Marfitsyna",
  email: "kgmarfitsyna@gmail.com",
  mobile: "+1 719 259 3091",
  paymentMethod: "RazorPay",
  port: "INBOM4",
  logistics: "DHL Express",
  awb: "RY426034563IN",
  shippingBill: "524566",
  sbDate: "21/05/2025",
  egm: "0003695",
  invoiceDate: "21/05/2025",
  invoiceCurrency: "INR",
  exchangeRate: "1",
  exportType: "Export with IGST",
  shippingAddress: {
    street: "68 Lady Hay Road",
    city: "Leicester",
    postalCode: "LE3 9SJ",
    country: "United Kingdom",
  },
  billingAddress: {
    street: "1 Kiln Orchard Way",
    city: "Birstall, Leicester",
    postalCode: "LE4 3NT",
    country: "United Kingdom",
  },
  items: [
    {
      id: 1,
      name: "Himalaya Liv 52 Tablet",
      qty: 10,
      hsn: "3004901",
      gstPercent: 5,
      rate: 220.0,
      discount: 10,
      discountRate: 198.0,
      amount: 1980.0,
    },
    {
      id: 2,
      name: "Baidyanath Prahakarvati 20 Tablet",
      qty: 5,
      hsn: "3004901",
      gstPercent: 12,
      rate: 120.0,
      discount: 10,
      discountRate: 108.0,
      amount: 540.0,
    },
  ],
  paymentRef: "ekifeikdhkihkqisdnjkid58784515$kibkqisb",
  totalItems: 2,
  totalQty: 15,
  amountInWords: "Two Thousand Five Hundred And Twenty Rupees",
  taxableAmount: 2367.86,
  igst: 2367.86,
  total: 2520.0,
};

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const invoice = INVOICE_DATA;

  return (
    <div className="min-h-screen bg-gray-bg p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-00 hover:text-blue-10 transition-colors text-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
          <span>Sales/{invoice.invoiceNo}</span>
        </button>
        <h1 className="title-2-bold text-gray-110 flex-1 text-center">Sales Invoice Details</h1>
        <div className="text-right">
          <p className="xsmall text-gray-10 mb-1">Order Id #</p>
          <p className="title-3 text-blue-00">{invoice.orderId}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-line p-6">
        {/* Top Section - Customer and Address Info */}
        <div className="grid grid-cols-4 gap-8 mb-8 pb-8 border-b border-gray-line">
          {/* Customer Info */}
          <div>
            <p className="xsmall text-gray-10 font-medium mb-2">Name</p>
            <p className="small text-gray-110 mb-4">{invoice.customerName}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-1">Email</p>
            <p className="xsmall text-gray-10 mb-4">{invoice.email}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-1">Mobile #</p>
            <p className="xsmall text-gray-10 mb-4">{invoice.mobile}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-1">Payment</p>
            <p className="small text-gray-110">{invoice.paymentMethod}</p>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="xsmall text-gray-10 font-medium mb-2">Shipping Address :</p>
            <p className="xsmall text-gray-10">{invoice.shippingAddress.street}</p>
            <p className="xsmall text-gray-10">{invoice.shippingAddress.city}</p>
            <p className="xsmall text-gray-10">{invoice.shippingAddress.postalCode}</p>
            <p className="xsmall text-gray-10">{invoice.shippingAddress.country}</p>
          </div>

          {/* Billing Address */}
          <div>
            <p className="xsmall text-gray-10 font-medium mb-2">Billing Address :</p>
            <p className="xsmall text-gray-10">{invoice.billingAddress.street}</p>
            <p className="xsmall text-gray-10">{invoice.billingAddress.city}</p>
            <p className="xsmall text-gray-10">{invoice.billingAddress.postalCode}</p>
            <p className="xsmall text-gray-10">{invoice.billingAddress.country}</p>
          </div>

          {/* Invoice Details */}
          <div>
            <p className="xsmall text-gray-10 font-medium mb-1">Invoice Date</p>
            <p className="xsmall text-gray-10 mb-3">{invoice.invoiceDate}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-1">Invoice Currency</p>
            <p className="xsmall text-gray-10 mb-3">{invoice.invoiceCurrency}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-1">Exchange Rate</p>
            <p className="xsmall text-gray-10 mb-3">{invoice.exchangeRate}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-1">Export Type</p>
            <p className="xsmall text-gray-10">{invoice.exportType}</p>
          </div>
        </div>

        {/* Shipping and Logistics Details */}
        <div className="mb-6 pb-6 border-b border-gray-line">
          <div className="flex gap-8 flex-wrap">
            <div>
              <p className="xsmall text-gray-10 font-medium mb-1">Port</p>
              <p className="xsmall text-gray-10">{invoice.port}</p>
            </div>
            <div>
              <p className="xsmall text-gray-10 font-medium mb-1">Logistics</p>
              <p className="xsmall text-gray-10">{invoice.logistics}</p>
            </div>
            <div>
              <p className="xsmall text-gray-10 font-medium mb-1">AWB</p>
              <p className="xsmall text-blue-00 font-medium">{invoice.awb}</p>
            </div>
            <div>
              <p className="xsmall text-gray-10 font-medium mb-1">Shipping Bill</p>
              <p className="xsmall text-gray-10">{invoice.shippingBill}</p>
            </div>
            <div>
              <p className="xsmall text-gray-10 font-medium mb-1">SB Date</p>
              <p className="xsmall text-gray-10">{invoice.sbDate}</p>
            </div>
            <div>
              <p className="xsmall text-gray-10 font-medium mb-1">EGM</p>
              <p className="xsmall text-gray-10">{invoice.egm}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6 pb-6 border-b border-gray-line">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-40">
                <tr>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">#</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">Product Name</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">Qty</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">HSN</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">GST %</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">Rate</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">Discount</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10 border-r border-gray-line">D. Rate</th>
                  <th className="px-3 py-2 text-left xsmall font-medium text-gray-10">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-line hover:bg-gray-40">
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">{item.id}</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">{item.name}</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">{item.qty}</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">{item.hsn}</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">{item.gstPercent}%</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">₹ {item.rate.toFixed(2)}</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">{item.discount}%</td>
                    <td className="px-3 py-2 xsmall text-gray-10 border-r border-gray-line">₹ {item.discountRate.toFixed(2)}</td>
                    <td className="px-3 py-2 xsmall text-gray-10 font-medium">₹ {item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary and Payment Info */}
        <div className="grid grid-cols-2 gap-8 mb-6 pb-6 border-b border-gray-line">
          <div>
            <p className="xsmall text-gray-10 font-medium mb-2">Payment Ref</p>
            <p className="xsmall text-gray-10 break-all mb-4">{invoice.paymentRef}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-2">Total Items/Qty</p>
            <p className="xsmall text-gray-10 mb-4">{invoice.totalItems}/{invoice.totalQty}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-2">A mount in words</p>
            <p className="xsmall text-gray-10">{invoice.amountInWords}</p>
          </div>

          <div className="text-right">
            <p className="xsmall text-gray-10 font-medium mb-2">Taxable Amount</p>
            <p className="small text-gray-10 mb-4">₹ {invoice.taxableAmount.toFixed(2)}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-2">IGST</p>
            <p className="small text-gray-10 mb-4">₹ {invoice.igst.toFixed(2)}</p>
            
            <p className="xsmall text-gray-10 font-medium mb-2">Total</p>
            <p className="title-2-bold text-blue-00">₹ {invoice.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Document Icons */}
        <div className="flex gap-8 mb-6 pb-6 border-b border-gray-line">
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-40 transition-colors">
            <FontAwesomeIcon icon={faFileInvoice} className="w-5 h-5 text-blue-00" />
            <span className="xsmall text-gray-10">Invoice</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-40 transition-colors">
            <FontAwesomeIcon icon={faFileAlt} className="w-5 h-5 text-blue-00" />
            <span className="xsmall text-gray-10">AWB</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-40 transition-colors">
            <FontAwesomeIcon icon={faFileContract} className="w-5 h-5 text-blue-00" />
            <span className="xsmall text-gray-10">SB</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button className="px-4 py-2 bg-blue-00 text-white xsmall font-medium rounded hover:bg-blue-10 transition-colors">
            Add/ Edit Shipping Details
          </button>
          <button className="px-4 py-2 bg-red-600 text-white xsmall font-medium rounded hover:bg-red-700 transition-colors">
            Cancel Invoice
          </button>
        </div>
      </div>
    </div>
  );
}