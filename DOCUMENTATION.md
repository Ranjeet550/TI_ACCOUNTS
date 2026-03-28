# ACCOUNTS App - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Authentication & Security](#authentication--security)
7. [API Integration](#api-integration)
8. [Components Guide](#components-guide)
9. [Data Flow](#data-flow)
10. [Development Guide](#development-guide)
11. [Deployment](#deployment)

---

## Overview

The **ACCOUNTS App** is a Next.js-based admin dashboard for managing sales and purchase transactions, invoices, and accounting operations. It provides a comprehensive interface for tracking orders, generating invoices, managing shipments, and viewing financial metrics.

### Key Capabilities
- **Sales Management**: Track admin-generated invoices and buyer transactions
- **Purchase Management**: Monitor seller-generated invoices and purchase orders
- **Invoice Management**: Create, view, and download invoices with detailed information
- **Financial Analytics**: Dashboard with revenue metrics, order statistics, and currency breakdowns
- **User Management**: Profile, security settings, and account management
- **Export Functionality**: Export transactions to CSV/Excel formats

### Technology Stack
- **Frontend**: Next.js 13+ with TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with custom interceptors
- **State Management**: React Context API
- **Authentication**: JWT with refresh token rotation
- **UI Components**: Lucide React icons, SweetAlert2 notifications
- **Database**: Connected to backend API (Node.js/Express)

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCOUNTS App (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Route Groups & Pages                    │   │
│  │  ├─ /(auth) - Login, Register, Password Reset       │   │
│  │  └─ /(dashboard)/(accounts) - Protected Routes      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Context Providers                          │   │
│  │  ├─ AuthProvider - User auth & token management     │   │
│  │  ├─ LoadingProvider - Global loading states         │   │
│  │  └─ PageTitleProvider - Dynamic page titles         │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Components & Pages                         │   │
│  │  ├─ DashboardLayout - Main layout wrapper           │   │
│  │  ├─ Sales/Purchase Pages - Transaction views        │   │
│  │  ├─ Invoice Pages - Invoice details & creation      │   │
│  │  └─ Profile/Settings - User management              │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Services Layer                             │   │
│  │  ├─ accountsService - Business logic                │   │
│  │  ├─ authService - Authentication                    │   │
│  │  └─ imageUploadService - File uploads               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Axios Instance (axiosConfig)              │   │
│  │  ├─ Request Interceptor - Add auth token            │   │
│  │  ├─ Response Interceptor - Handle errors            │   │
│  │  └─ Token Refresh - Auto-refresh on expiration      │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │      Backend API (Node.js/Express)                  │   │
│  │  Base URL: https://api.totallyindian.com/app/v1     │   │
│  │  ├─ /admin/auth/* - Authentication endpoints        │   │
│  │  ├─ /accounts/sales/* - Sales transactions          │   │
│  │  ├─ /accounts/purchase/* - Purchase transactions    │   │
│  │  └─ /accounts/orders/* - Order details              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Git
- Environment variables configured (.env.development, .env.production)

### Installation

```bash
# Navigate to ACCOUNTS directory
cd ACCOUNTS

# Install dependencies
npm install

# Set up environment variables
cp .env.development .env.local

# Start development server
npm run dev
```

### Environment Variables

Create `.env.local` with the following:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.totallyindian.com/app/v1

# ReCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_key

# Encryption (optional)
NEXT_PUBLIC_ENCRYPTION_DISABLED=false

# App Configuration
NEXT_PUBLIC_APP_NAME=TotallyIndian Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Testing
npm run test

# Linting
npm run lint
```

---

## Features

### 1. Authentication & Authorization
- Email/password login with validation
- JWT-based authentication with refresh tokens
- Automatic token refresh on expiration
- Role-based access control (Admin, Seller)
- Protected routes with auth guards
- Logout functionality with token cleanup

### 2. Sales Management
- View all admin-generated invoices
- Filter by date range, status (all, draft, pending, cancelled)
- Pagination support (50 items per page)
- Summary metrics (total amount, cancelled amount)
- Currency breakdown for multi-currency transactions
- Bulk selection for batch operations
- Export to CSV/Excel

### 3. Invoice Management
- Create new invoices with product details
- View detailed invoice information
- Customer and shipping address management
- Product variant tracking
- Tax calculations (IGST, GST)
- Logistics and tracking information
- Download invoices as PDF
- Invoice status tracking

### 4. Purchase Management
- Track seller-generated invoices
- View purchase transactions with seller details
- Filter by date range and status
- Payment method tracking
- Shipment information
- Purchase summary metrics

### 5. Dashboard Analytics
- Sales vs Purchase tabs
- Order statistics (total, pending, completed, cancelled)
- Revenue metrics with currency breakdown
- Date range selection for custom reports
- Visual charts and graphs
- Quick action buttons

### 6. User Management
- Profile information viewing/editing
- Security settings (password change, 2FA)
- Account preferences
- Notification settings
- Activity logs

---

## Project Structure

```
ACCOUNTS/
├── app/
│   ├── (auth)/                          # Authentication routes
│   │   ├── layout.tsx                   # Auth layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx                 # Login page
│   │   └── seller/
│   │       ├── change-password/
│   │       └── forgot-password/
│   │
│   ├── (dashboard)/                     # Protected dashboard routes
│   │   ├── layout.tsx                   # Dashboard layout
│   │   ├── error.tsx                    # Error boundary
│   │   └── (accounts)/
│   │       ├── dashboard/               # Main dashboard
│   │       ├── sales/                   # Sales transactions
│   │       │   ├── page.tsx             # Sales list
│   │       │   ├── create/              # Create invoice
│   │       │   └── invoice/[id]/        # Invoice details
│   │       ├── purchases/               # Purchase transactions
│   │       ├── invoices/                # Invoice management
│   │       ├── profile/                 # User profile
│   │       ├── security/                # Security settings
│   │       └── settings/                # App settings
│   │
│   ├── api/                             # API routes
│   │   └── upload/
│   │       └── image/                   # Image upload endpoint
│   │
│   ├── components/                      # React components
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── common/                      # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── FormInput.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── TableSkeleton.tsx
│   │   │   └── ...
│   │   ├── admin/                       # Admin-specific components
│   │   │   ├── BankDetailsModal.tsx
│   │   │   ├── CascadingCategorySelector.tsx
│   │   │   └── ...
│   │   ├── seller/                      # Seller-specific components
│   │   │   ├── FulfillOrderModal.tsx
│   │   │   └── ...
│   │   └── invoices/                    # Invoice components
│   │       ├── invoiceBuyer.js
│   │       └── invoiceSeller.js
│   │
│   ├── lib/                             # Utilities and services
│   │   ├── axiosConfig.ts               # Axios configuration
│   │   ├── config.ts                    # App configuration
│   │   ├── recaptchaConfig.ts           # ReCAPTCHA setup
│   │   ├── swalConfig.ts                # SweetAlert2 config
│   │   ├── utils.ts                     # General utilities
│   │   ├── services/
│   │   │   ├── admin/
│   │   │   │   └── authService.ts       # Admin auth
│   │   │   ├── buyer/
│   │   │   ├── seller/
│   │   │   ├── imageUploadService.ts
│   │   │   └── presignedUrlService.ts
│   │   └── utils/
│   │       ├── validations.ts           # Form validations
│   │       ├── stringUtils.ts
│   │       ├── numberInputUtils.ts
│   │       ├── orderItemUtils.ts
│   │       └── ...
│   │
│   ├── providers/                       # Context providers
│   │   ├── AuthProvider.tsx
│   │   ├── LoadingProvider.tsx
│   │   └── PageTitleProvider.tsx
│   │
│   ├── data/                            # Static data
│   │   ├── navigationCategories.json
│   │   ├── sidebar.json
│   │   └── user.json
│   │
│   ├── hooks/                           # Custom React hooks
│   │   └── useUnsavedChanges.js
│   │
│   ├── styles/                          # Global styles
│   │   └── globals.css
│   │
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Home page
│   ├── error.tsx                        # Global error boundary
│   └── globals.css                      # Global styles
│
├── public/                              # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.png
│
├── .env.development                     # Development env vars
├── .env.production                      # Production env vars
├── .env.test                            # Test env vars
├── .gitignore
├── next.config.js                       # Next.js configuration
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── package.json
└── README.md
```

---

## Authentication & Security

### Authentication Flow

```
1. User enters credentials on login page
   ↓
2. Credentials sent to /admin/auth/login endpoint
   ↓
3. Backend validates and returns access_token + refresh_token
   ↓
4. Tokens stored in localStorage
   ↓
5. User object stored in localStorage
   ↓
6. AuthProvider sets user state
   ↓
7. User redirected to dashboard
   ↓
8. Protected routes check auth token
   ↓
9. If token expired, refresh token used to get new access token
   ↓
10. If refresh fails, user redirected to login
```

### Token Management

**Access Token**
- Short-lived JWT token (typically 15-30 minutes)
- Sent in Authorization header: `Bearer {token}`
- Used for API requests

**Refresh Token**
- Long-lived token (typically 7-30 days)
- Stored securely in localStorage
- Used to obtain new access token when expired

### Security Features

1. **JWT Authentication**
   - Tokens validated on backend
   - Automatic expiration
   - Refresh token rotation

2. **Protected Routes**
   - `useRequireAuth` hook checks authentication
   - Unauthenticated users redirected to login
   - Route guards in layout components

3. **Axios Interceptors**
   - Request interceptor adds auth token
   - Response interceptor handles 401 errors
   - Automatic token refresh on expiration
   - Queue system for failed requests

4. **Encryption (Optional)**
   - Request/response encryption available
   - Can be disabled via `NEXT_PUBLIC_ENCRYPTION_DISABLED`
   - Uses custom encryption utilities

5. **ReCAPTCHA Integration**
   - Available for login form
   - Prevents automated attacks
   - Configurable via environment variables

### Best Practices

- Never store sensitive data in localStorage (except tokens)
- Always use HTTPS in production
- Implement CORS properly on backend
- Validate all user inputs
- Use environment variables for sensitive config
- Implement rate limiting on backend
- Log security events for audit trails

---

## API Integration

### Base Configuration

```typescript
// API Base URL
const API_BASE_URL = "https://api.totallyindian.com/app/v1";

// Axios Instance with interceptors
import axiosInstance from "@/lib/axiosConfig";
```

### Main Endpoints

#### Authentication
```
POST /admin/auth/login
  Request: { email, password }
  Response: { access_token, refresh_token, data: { id, email, username } }

POST /admin/auth/refresh
  Request: { refresh_token }
  Response: { access_token, refresh_token }

POST /admin/auth/logout
  Request: {}
  Response: { success: true }
```

#### Sales Transactions
```
GET /accounts/sales/transactions
  Query: { page, limit, startDate, endDate, status, tab }
  Response: {
    success: boolean,
    data: {
      transactions: SalesTransaction[],
      pagination: { currentPage, totalPages, totalTransactions, hasNext, hasPrev },
      summary: { totalValue, cancelledValue, currency, totalAmount, cancelledAmount }
    }
  }

GET /accounts/sales/summary
  Query: { startDate, endDate }
  Response: {
    success: boolean,
    data: {
      totalOrders, totalRevenue, currencyBreakdown, period
    }
  }
```

#### Purchase Transactions
```
GET /accounts/purchase/transactions
  Query: { page, limit, startDate, endDate, status }
  Response: {
    success: boolean,
    data: {
      transactions: PurchaseTransaction[],
      pagination: { ... },
      summary: { ... }
    }
  }
```

#### Order Details
```
GET /accounts/orders/{orderId}
  Response: {
    success: boolean,
    data: {
      id, orderNumber, status, invoiceCreated,
      User: { id, first_name, last_name, email, phone },
      Payment: { id, amount, currency, status, gateway },
      OrderItems: [ { id, quantityRequested, unitPrice, Product: { ... } } ],
      OrderShipments: [ { ... } ]
    }
  }
```

#### Invoice Operations
```
POST /accounts/invoices/create
  Request: { orderId, invoiceType, items, ... }
  Response: { success: boolean, data: { invoiceId, invoiceNumber } }

GET /accounts/invoices/{invoiceId}
  Response: { success: boolean, data: { ... } }

POST /accounts/invoices/{invoiceId}/download
  Response: PDF file

POST /accounts/invoices/export
  Query: { format: 'csv' | 'excel', filters: {...} }
  Response: File download
```

### Service Layer

The `accountsService.ts` provides high-level methods:

```typescript
// Sales
accountsService.getSalesTransactions(filters)
accountsService.getSalesSummary(dateRange)
accountsService.getOrderDetails(orderId)

// Purchases
accountsService.getPurchaseTransactions(filters)
accountsService.getPurchaseSummary(dateRange)

// Invoices
accountsService.createInvoice(data)
accountsService.getInvoiceDetails(invoiceId)
accountsService.downloadInvoice(invoiceId)
accountsService.exportOrders(format, filters)

// Orders
accountsService.getOrders(filters)
accountsService.updateOrderStatus(orderId, status)
```

### Error Handling

```typescript
try {
  const response = await accountsService.getSalesTransactions(filters);
  if (response.success) {
    // Handle success
  } else {
    // Handle API error
    showErrorMessage(response.message);
  }
} catch (error) {
  // Handle network/client error
  console.error(error);
  showErrorMessage("Failed to load data");
}
```

---

## Components Guide

### Layout Components

#### DashboardLayout
Main layout wrapper for protected routes.

```typescript
<DashboardLayout>
  {children}
</DashboardLayout>
```

Features:
- Header with navigation
- Sidebar with menu
- Main content area with scrolling
- Auth check with redirect

#### Header
Top navigation bar with user menu.

Features:
- Logo and branding
- Search functionality
- User profile dropdown
- Notifications
- Logout button

#### Sidebar
Left navigation menu.

Features:
- Navigation links
- Active route highlighting
- Collapsible menu items
- Role-based menu items

### Common Components

#### FormInput
Reusable form input component.

```typescript
<FormInput
  label="Email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  placeholder="Enter email"
/>
```

#### Button
Reusable button component.

```typescript
<Button
  variant="primary" | "secondary" | "danger"
  size="sm" | "md" | "lg"
  disabled={isLoading}
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Modal
Reusable modal dialog.

```typescript
<Modal
  isOpen={isOpen}
  title="Modal Title"
  onClose={handleClose}
>
  Modal content
</Modal>
```

#### TableSkeleton
Loading skeleton for tables.

```typescript
<TableSkeleton rows={5} columns={6} />
```

### Admin Components

#### BankDetailsModal
Modal for managing bank account details.

#### CascadingCategorySelector
Multi-level category selector for products.

#### ShippingAgenciesCard
Card component for shipping agency management.

### Seller Components

#### FulfillOrderModal
Modal for marking orders as fulfilled.

#### RaisePickupModal
Modal for requesting pickup from logistics.

#### RefundConfirmationModal
Modal for confirming refunds.

### Invoice Components

#### invoiceBuyer.js
Renders buyer invoice template.

#### invoiceSeller.js
Renders seller invoice template.

---

## Data Flow

### Sales Transaction Data Flow

```
1. User navigates to /sales
   ↓
2. SalesPage component mounts
   ↓
3. useEffect triggers fetchSalesData()
   ↓
4. accountsService.getSalesTransactions() called
   ↓
5. Axios makes GET request to /accounts/sales/transactions
   ↓
6. Request interceptor adds auth token
   ↓
7. Backend processes request and returns data
   ↓
8. Response interceptor handles response
   ↓
9. Data transformed to SalesTransaction[] format
   ↓
10. Component state updated with transactions
   ↓
11. UI renders transaction table
   ↓
12. User can filter, sort, paginate, or select rows
   ↓
13. Selected rows can be exported or bulk-updated
```

### Invoice Detail Data Flow

```
1. User clicks on invoice in sales list
   ↓
2. Navigates to /sales/invoice/[id]
   ↓
3. InvoiceDetailPage component mounts
   ↓
4. useEffect triggers fetchInvoiceData()
   ↓
5. accountsService.getOrderDetails(invoiceId) called
   ↓
6. Axios makes GET request to /accounts/orders/{id}
   ↓
7. Backend returns order with related data
   ↓
8. Order data transformed to invoice format:
   - Extract customer info from User
   - Extract payment info from Payment
   - Extract items from OrderItems
   - Calculate totals and taxes
   - Format addresses
   ↓
9. Component state updated with invoice data
   ↓
10. UI renders invoice details
   ↓
11. User can download PDF or print
```

### Authentication Data Flow

```
1. User enters credentials on login page
   ↓
2. Form validation
   ↓
3. authService.login(credentials) called
   ↓
4. Axios makes POST to /admin/auth/login
   ↓
5. Backend validates credentials
   ↓
6. If valid, returns access_token + refresh_token
   ↓
7. Tokens stored in localStorage
   ↓
8. User object created and stored
   ↓
9. AuthProvider updates user state
   ↓
10. User redirected to /dashboard
   ↓
11. Protected routes check auth token
   ↓
12. If token expired, refresh token used
   ↓
13. If refresh fails, user redirected to login
```

---

## Development Guide

### Adding a New Page

1. Create page directory under `app/(dashboard)/(accounts)/`
2. Create `page.tsx` file
3. Add route to sidebar navigation
4. Implement page component with:
   - useEffect for data fetching
   - Loading and error states
   - UI rendering

Example:

```typescript
// app/(dashboard)/(accounts)/new-feature/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import accountsService from "@/lib/services/accountsService";

export default function NewFeaturePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await accountsService.getNewFeatureData();
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Page content */}
    </div>
  );
}
```

### Adding a New Service Method

1. Open `lib/services/accountsService.ts`
2. Add new method to service class
3. Call backend API endpoint
4. Return typed response

Example:

```typescript
export async function getNewFeatureData(filters: any) {
  try {
    const response = await axiosInstance.get(
      "/accounts/new-feature",
      { params: filters }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### Adding a New Component

1. Create component file in appropriate directory
2. Use TypeScript for type safety
3. Export as default or named export
4. Add JSDoc comments

Example:

```typescript
// app/components/common/NewComponent.tsx
import React from "react";

interface NewComponentProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * NewComponent - Description of what it does
 * @param props - Component props
 */
export default function NewComponent({
  title,
  onClick,
  disabled = false,
}: NewComponentProps) {
  return (
    <div onClick={onClick} className={disabled ? "opacity-50" : ""}>
      {title}
    </div>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use consistent spacing (px-4, py-2, etc.)
- Use semantic color classes (text-red-500, bg-blue-100)
- Create reusable component variants

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Debugging

1. Use browser DevTools
2. Check Network tab for API calls
3. Use React DevTools for component state
4. Check localStorage for tokens
5. Use console.log for debugging
6. Check backend logs for API errors

---

## Deployment

### Build Process

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Environment Setup

Create `.env.production`:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.totallyindian.com/app/v1
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=production_key
NEXT_PUBLIC_ENCRYPTION_DISABLED=false
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Server
```bash
# Build
npm run build

# Copy to server
scp -r .next/ user@server:/var/www/accounts/

# Start with PM2
pm2 start "npm start" --name "accounts-app"
```

### Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Optimize image sizes
   - Use WebP format

2. **Code Splitting**
   - Dynamic imports for large components
   - Route-based code splitting

3. **Caching**
   - Browser caching headers
   - API response caching
   - Static generation where possible

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Track user analytics

---

## Troubleshooting

### Common Issues

**Issue: "Token expired" error**
- Solution: Check token refresh logic in axiosConfig
- Verify refresh token is stored
- Check backend token expiration settings

**Issue: "Unauthorized" on protected routes**
- Solution: Verify auth token in localStorage
- Check AuthProvider is wrapping routes
- Verify login endpoint returns tokens

**Issue: CORS errors**
- Solution: Check backend CORS configuration
- Verify API_BASE_URL is correct
- Check request headers

**Issue: Invoice data not loading**
- Solution: Verify order ID is correct
- Check backend order endpoint
- Verify user has permission to view order

**Issue: Slow page load**
- Solution: Check network requests in DevTools
- Optimize API queries
- Implement pagination
- Use React.memo for expensive components

---

## Support & Resources

- **Documentation**: See this file
- **Backend API**: https://api.totallyindian.com/app/v1
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Last Updated**: March 28, 2026
**Version**: 1.0.0
**Maintainer**: Development Team
