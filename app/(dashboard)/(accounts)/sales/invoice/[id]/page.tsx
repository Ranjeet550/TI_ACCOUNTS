"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download, CloudUpload } from "lucide-react";
import accountsService from "@/lib/services/accountsService";

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchInvoiceData();
  }, [invoiceId]);

  const fetchInvoiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await accountsService.getOrderDetails(invoiceId);

      if (response.success && response.data) {
        const order = response.data as any;
        
        // Helper function to format address properly from JSON
        const formatAddress = (addressObj: any) => {
          if (!addressObj) {
            return { line1: "", line2: "", line3: "", line4: "" };
          }
          
          // Extract address components from JSON keys
          const line1 = addressObj.address_line_1 || "";
          const line2 = addressObj.address_line_2 || "";
          const line3 = `${addressObj.city || ""} ${addressObj.state || ""}`.trim();
          const line4 = `${addressObj.zip_code || ""} ${addressObj.country || ""}`.trim();
          
          return {
            line1: line1 || "",
            line2: line2 || "",
            line3: line3 || "",
            line4: line4 || ""
          };
        };

        // Helper function to convert number to words
        const numberToWords = (num: number): string => {
          const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
          const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
          const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
          const scales = ['', 'Thousand', 'Lakh', 'Crore'];

          if (num === 0) return 'Zero';

          let words = '';
          let scaleIndex = 0;

          while (num > 0) {
            let groupValue = num % 1000;
            if (groupValue !== 0) {
              words = convertGroupToWords(groupValue, ones, teens, tens) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : '') + ' ' + words;
            }
            num = Math.floor(num / 1000);
            scaleIndex++;
          }

          return words.trim() + ' Rupees Only';
        };

        const convertGroupToWords = (num: number, ones: string[], teens: string[], tens: string[]): string => {
          let words = '';
          const hundreds = Math.floor(num / 100);
          const remainder = num % 100;

          if (hundreds > 0) {
            words += ones[hundreds] + ' Hundred ';
          }

          if (remainder >= 20) {
            words += tens[Math.floor(remainder / 10)] + ' ';
            if (remainder % 10 > 0) {
              words += ones[remainder % 10] + ' ';
            }
          } else if (remainder >= 10) {
            words += teens[remainder - 10] + ' ';
          } else if (remainder > 0) {
            words += ones[remainder] + ' ';
          }

          return words.trim();
        };
        
        // Calculate totals
        const subtotal = order.OrderItems?.reduce((sum: number, item: any) => {
          const unitPrice = parseFloat(item.unitPrice) || 0;
          const qty = parseInt(item.quantityRequested) || 0;
          return sum + (qty * unitPrice);
        }, 0) || 0;

        const shippingCost = parseFloat(order.shipping) || 0;
        const taxAmount = parseFloat(order.tax) || 0;
        const discountAmount = parseFloat(order.discountAmount) || 0;
        const finalTotal = parseFloat(order.finalAmount) || (subtotal + shippingCost + taxAmount - discountAmount);

        // Transform order data to invoice format
        const transformedData = {
          invoiceNo: order.invoice_number || order.OrderShipments?.[0]?.invoice_number || "N/A",
          orderId: order.orderNumber || order.id,
          customerName: order.User ? `${order.User.first_name} ${order.User.last_name}` : "N/A",
          customerEmail: order.User?.email || "N/A",
          customerMobile: order.User?.phone || "N/A",
          shippingAddress: formatAddress(order.shipping_address),
          billingAddress: formatAddress(order.billing_address),
          invoiceDate: order.invoice_date ? new Date(order.invoice_date).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString(),
          invoiceCurrency: order.Payment?.currency || "INR",
          exchangeRate: order.exchange_rate || "1",
          exportType: order.export_type || "Export with IGST",
          payment: order.Payment?.gateway || "N/A",
          paymentStatus: order.Payment?.status || "N/A",
          port: order.port || "INBOM4",
          logistics: order.shipping_carrier || order.logistics || "N/A",
          awb: order.OrderShipments?.[0]?.shippingOrderId || order.tracking_number || "N/A",
          shippingBill: order.OrderShipments?.[0]?.invoice_number || order.shipping_bill || "N/A",
          sbDate: order.OrderShipments?.[0]?.invoice_date ? new Date(order.OrderShipments[0].invoice_date).toLocaleDateString() : order.sb_date || "N/A",
          egm: order.egm || "0003695",
          status: order.status || "pending",
          items: order.OrderItems?.map((item: any, idx: number) => {
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const qty = parseInt(item.quantityRequested) || 0;
            const productData = item.productData || item.Product || {};
            
            // Extract variant information from variantData
            let variantText = "N/A";
            if (item.variantData && item.variantData.option_values) {
              variantText = Object.entries(item.variantData.option_values)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
            }
            
            return {
              id: idx + 1,
              name: productData.title || item.name || "Product",
              variant: variantText,
              qty: qty.toString(),
              hsn: productData.hs_code || item.hsn || "30049011",
              gst: productData.gst_percent ? `${productData.gst_percent}%` : item.gst || "05%",
              rate: unitPrice.toFixed(2),
              discount: item.discount || "0%",
              dRate: (unitPrice * (1 - (parseFloat(item.discount || "0") / 100))).toFixed(2),
              amount: (qty * unitPrice * (1 - (parseFloat(item.discount || "0") / 100))).toFixed(2)
            };
          }) || [],
          paymentRef: order.Payment?.id || order.payment_ref || "N/A",
          totalItems: `${order.OrderItems?.length || 0}/${order.OrderItems?.reduce((sum: number, item: any) => sum + (parseInt(item.quantityRequested) || 0), 0) || 0}`,
          amountInWords: numberToWords(Math.floor(finalTotal)),
          subtotal: subtotal.toFixed(2),
          shippingCost: shippingCost.toFixed(2),
          discount: discountAmount.toFixed(2),
          taxableAmount: subtotal.toFixed(2),
          tax: taxAmount.toFixed(2),
          igst: taxAmount.toFixed(2),
          total: finalTotal.toFixed(2)
        };

        setInvoiceData(transformedData);
      } else {
        setError(response.message || "Invoice not found");
      }
    } catch (err: any) {
      setError(err.message || "Error fetching invoice");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/sales/invoice/download-pdf/${invoiceId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.invoiceNo}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Failed to download invoice: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        {/* Header Skeleton */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-3 bg-gray-100 rounded w-48 animate-pulse"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>

        <div className="p-6">
          {/* Customer Details Grid Skeleton */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Logistics Info Skeleton */}
          <div className="flex gap-8 mb-8 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Product Table Skeleton */}
          <div className="mb-8">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-300">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <th key={i} className="py-2 px-2">
                        <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((row) => (
                    <tr key={row} className="border-b border-gray-200">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                        <td key={col} className="py-3 px-2">
                          <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Section Skeleton */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
                </div>
              ))}
              <div className="flex gap-4 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3 flex flex-col">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-end gap-2">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-20 animate-pulse"></div>
                </div>
              ))}
              <div className="flex gap-3 mt-6 justify-end">
                <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="bg-white min-h-screen p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 text-sm">{error || "Invoice not found"}</p>
          <Link href="/sales" className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Back to Sales
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <Link href="/sales" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
            <span>←</span>
            <span>Sales/{invoiceData.invoiceNo}</span>
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Sales Invoice Details</h1>
          <div className="text-blue-600 font-medium text-sm">Order Id # {invoiceData.orderId}</div>
        </div>
      </div>

      <div className="p-6">
        {/* Customer Details Section */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {/* Left Column - Customer Info */}
          <div className="space-y-0.5">
            <div>
              <span className="text-sm text-gray-700 font-medium">Customer Info :</span>
              <div className="text-sm text-gray-900 space-y-0.5">
                <p className="leading-snug"><span className="text-gray-700">Name:</span> {invoiceData.customerName}</p>
                <p className="leading-snug"><span className="text-gray-700">Email:</span> {invoiceData.customerEmail}</p>
                <p className="leading-snug"><span className="text-gray-700">Mobile:</span> {invoiceData.customerMobile}</p>
                <p className="leading-snug"><span className="text-gray-700">Payment:</span> {invoiceData.payment}</p>
                <p className="leading-snug"><span className="text-gray-700">Status:</span> <span className={`px-2 py-0.5 rounded text-xs font-medium ${invoiceData.status === 'delivered' ? 'bg-green-100 text-green-800' : invoiceData.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{invoiceData.status}</span></p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-0.5">
            <div>
              <span className="text-sm text-gray-700 font-medium">Shipping Address :</span>
              <div className="text-sm text-gray-900 space-y-0.5">
                {invoiceData.shippingAddress.line1 && <p className="leading-snug">{invoiceData.shippingAddress.line1}</p>}
                {invoiceData.shippingAddress.line2 && <p className="leading-snug">{invoiceData.shippingAddress.line2}</p>}
                {invoiceData.shippingAddress.line3 && <p className="leading-snug">{invoiceData.shippingAddress.line3}</p>}
                {invoiceData.shippingAddress.line4 && <p className="leading-snug">{invoiceData.shippingAddress.line4}</p>}
                {!invoiceData.shippingAddress.line1 && !invoiceData.shippingAddress.line2 && !invoiceData.shippingAddress.line3 && !invoiceData.shippingAddress.line4 && <p className="leading-snug text-gray-500">No address provided</p>}
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-0.5">
            <div>
              <span className="text-sm text-gray-700 font-medium">Billing Address :</span>
              <div className="text-sm text-gray-900 space-y-0.5">
                {invoiceData.billingAddress.line1 && <p className="leading-snug">{invoiceData.billingAddress.line1}</p>}
                {invoiceData.billingAddress.line2 && <p className="leading-snug">{invoiceData.billingAddress.line2}</p>}
                {invoiceData.billingAddress.line3 && <p className="leading-snug">{invoiceData.billingAddress.line3}</p>}
                {invoiceData.billingAddress.line4 && <p className="leading-snug">{invoiceData.billingAddress.line4}</p>}
                {!invoiceData.billingAddress.line1 && !invoiceData.billingAddress.line2 && !invoiceData.billingAddress.line3 && !invoiceData.billingAddress.line4 && <p className="leading-snug text-gray-500">No address provided</p>}
              </div>
            </div>
          </div>

          {/* Right Column - Invoice Details */}
          <div className="space-y-0.5">
            <div>
              <span className="text-sm text-gray-700 font-medium">Invoice Details :</span>
              <div className="text-sm text-gray-900 space-y-0.5">
                <p className="leading-snug"><span className="text-gray-700">Date:</span> {invoiceData.invoiceDate}</p>
                <p className="leading-snug"><span className="text-gray-700">Currency:</span> {invoiceData.invoiceCurrency}</p>
                <p className="leading-snug"><span className="text-gray-700">Exchange Rate:</span> {invoiceData.exchangeRate}</p>
                <p className="leading-snug"><span className="text-gray-700">Export Type:</span> {invoiceData.exportType}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logistics Info */}
        <div className="flex gap-8 mb-8 text-base flex-wrap">
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">Port :</span>
            <span className="text-gray-900">{invoiceData.port}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">Logistics :</span>
            <span className="text-gray-900">{invoiceData.logistics}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">AWB :</span>
            <span className="text-gray-900">{invoiceData.awb}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">Shipping Bill :</span>
            <span className="text-gray-900">{invoiceData.shippingBill}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">SB Date :</span>
            <span className="text-gray-900">{invoiceData.sbDate}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-700 font-medium">EGM :</span>
            <span className="text-gray-900">{invoiceData.egm}</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Product Details</h2>
          
          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-center py-2 px-1 text-gray-700 font-semibold w-8">#</th>
                  <th className="text-left py-2 px-1 text-gray-700 font-semibold w-1/2">Product Name</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">Qty</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">HSN</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">GST %</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">Rate</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">Discount</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">D. Rate</th>
                  <th className="text-center py-2 px-2 text-gray-700 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2 px-1 text-gray-900 text-center align-top">{item.id}</td>
                    <td className="py-2 px-1 text-gray-900 text-left break-words">
                      <div>{item.name}</div>
                      {item.variant !== "N/A" && (
                        <div className="text-xs text-gray-500 mt-1">{item.variant}</div>
                      )}
                    </td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">{item.qty}</td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">{item.hsn}</td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">{item.gst}</td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">₹ {item.rate}</td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">{item.discount}</td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">₹ {item.dRate}</td>
                    <td className="py-2 px-2 text-gray-900 text-center align-top">₹ {item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <span className="text-base text-gray-700">Payment Ref :</span>
              <p className="text-base text-gray-900 inline ml-2">{invoiceData.paymentRef}</p>
            </div>
            <div>
              <span className="text-base text-gray-700">Total Items/Qty :</span>
              <p className="text-base text-gray-900 inline ml-2">{invoiceData.totalItems}</p>
            </div>
            <div>
              <span className="text-base text-gray-700">A mount in words :</span>
              <p className="text-base text-gray-900 inline ml-2">{invoiceData.amountInWords}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="flex flex-col items-center cursor-pointer hover:opacity-80 disabled:opacity-50"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <Download size={20} className="text-gray-700" />
                </div>
                <span className="text-xs text-gray-600">{downloading ? 'Downloading...' : 'Invoice'}</span>
              </button>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <CloudUpload size={20} className="text-gray-700" />
                </div>
                <span className="text-xs text-gray-600">AWB</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <CloudUpload size={20} className="text-gray-700" />
                </div>
                <span className="text-xs text-gray-600">SB</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3 flex flex-col">
            <div className="text-right flex flex-col">
              <div className="flex justify-end gap-2">
                <span className="text-base text-gray-700">Subtotal :</span>
                <p className="text-base text-gray-900 font-semibold">₹ {invoiceData.subtotal}</p>
              </div>
            </div>
            {parseFloat(invoiceData.shippingCost) > 0 && (
              <div className="text-right flex flex-col">
                <div className="flex justify-end gap-2">
                  <span className="text-base text-gray-700">Shipping :</span>
                  <p className="text-base text-gray-900 font-semibold">₹ {invoiceData.shippingCost}</p>
                </div>
              </div>
            )}
            {parseFloat(invoiceData.discount) > 0 && (
              <div className="text-right flex flex-col">
                <div className="flex justify-end gap-2">
                  <span className="text-base text-gray-700">Discount :</span>
                  <p className="text-base text-gray-900 font-semibold">-₹ {invoiceData.discount}</p>
                </div>
              </div>
            )}
            <div className="text-right flex flex-col">
              <div className="flex justify-end gap-2">
                <span className="text-base text-gray-700">Taxable Amount :</span>
                <p className="text-base text-gray-900 font-semibold">₹ {invoiceData.taxableAmount}</p>
              </div>
            </div>
            {parseFloat(invoiceData.tax) > 0 && (
              <div className="text-right flex flex-col">
                <div className="flex justify-end gap-2">
                  <span className="text-base text-gray-700">Tax (IGST) :</span>
                  <p className="text-base text-gray-900 font-semibold">₹ {invoiceData.tax}</p>
                </div>
              </div>
            )}
            <div className="text-right flex flex-col border-t-2 border-gray-300 pt-2 mt-2">
              <div className="flex justify-end gap-2">
                <span className="text-base text-gray-700 font-semibold">Total :</span>
                <p className="text-lg text-gray-900 font-bold">₹ {invoiceData.total}</p>
              </div>
            </div>
            <div className="text-right flex flex-col mt-2">
              <div className="flex justify-end gap-2">
                <span className="text-base text-gray-700">Payment Status :</span>
                <p className={`text-base font-semibold px-2 py-0.5 rounded ${invoiceData.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : invoiceData.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{invoiceData.paymentStatus}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <Link href={`/sales/create?edit=true&invoiceId=${invoiceData.invoiceNo}&orderId=${invoiceData.orderId}`} className="bg-blue-900 text-white px-8 py-2 rounded-lg hover:bg-blue-800 font-medium inline-block">
                Add/ Edit Shipping Details
              </Link>
              <button className="bg-red-500 text-white px-8 py-2 rounded-lg hover:bg-red-600 font-medium">
                Cancel Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
