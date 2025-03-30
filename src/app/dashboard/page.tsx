'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Mock data for charts
const deliveryData = [
  { name: 'Mon', delivered: 92, opened: 78, responded: 65 },
  { name: 'Tue', delivered: 95, opened: 80, responded: 69 },
  { name: 'Wed', delivered: 98, opened: 85, responded: 72 },
  { name: 'Thu', delivered: 94, opened: 79, responded: 67 },
  { name: 'Fri', delivered: 96, opened: 83, responded: 70 },
  { name: 'Sat', delivered: 91, opened: 75, responded: 62 },
  { name: 'Sun', delivered: 88, opened: 72, responded: 59 },
];

const engagementData = [
  { name: 'Week 1', engagement: 65 },
  { name: 'Week 2', engagement: 68 },
  { name: 'Week 3', engagement: 75 },
  { name: 'Week 4', engagement: 82 },
  { name: 'Week 5', engagement: 78 },
  { name: 'Week 6', engagement: 84 },
  { name: 'Week 7', engagement: 89 },
  { name: 'Week 8', engagement: 92 },
];

const conversionData = [
  { name: 'Visit', value: 1000 },
  { name: 'Interact', value: 750 },
  { name: 'Convert', value: 480 },
  { name: 'Return', value: 320 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const abTestData = [
  {
    name: 'Version A',
    delivery: 95,
    engagement: 78,
    conversion: 42,
  },
  {
    name: 'Version B',
    delivery: 92,
    engagement: 82,
    conversion: 48,
  },
];

// Mock flow data
const mockFlows = [
  {
    id: 1,
    name: "Inquiry & Support Flow",
    description: "Answer customer queries and resolve issues",
    type: "support",
    category: "Customer Support"
  },
  {
    id: 2,
    name: "Order Tracking & Post-Sales",
    description: "Help customers track orders and handle returns",
    type: "order",
    category: "Sales"
  },
  {
    id: 3,
    name: "Promotional & Upselling Flow",
    description: "Promote products and drive sales",
    type: "promo",
    category: "Marketing"
  },
  {
    id: 4,
    name: "Booking & Appointment Flow",
    description: "Allow customers to schedule services",
    type: "booking",
    category: "Services"
  },
  {
    id: 5,
    name: "Lead Generation & Qualification",
    description: "Capture potential customer details",
    type: "leads",
    category: "Marketing"
  },
  {
    id: 6,
    name: "Feedback & Review Collection",
    description: "Gather customer reviews and testimonials",
    type: "feedback",
    category: "Customer Support"
  }
];

// Define KPI categories per flow type
const kpiCategories = {
  support: ["engagement", "message", "retention"],
  order: ["engagement", "message", "retention"],
  promo: ["engagement", "message", "conversion"],
  booking: ["engagement", "message", "conversion"],
  leads: ["engagement", "message", "conversion"],
  feedback: ["engagement", "message", "retention"]
};

// Define KPIs for each category
const kpisByCategory = {
  engagement: [
    { id: "completion", name: "Flow Completion Rate", value: "78", unit: "%", change: 2.5, color: "#0088FE" },
    { id: "dropoff", name: "Drop-off Rate", value: "22", unit: "%", change: -1.2, color: "#FF8042" },
    { id: "duration", name: "Average Flow Duration", value: "2.4", unit: "min", change: -0.3, color: "#00C49F" },
    { id: "success", name: "Flow Success Score", value: "84", unit: "%", change: 3.1, color: "#0088FE" }
  ],
  message: [
    { id: "response", name: "Message Response Rate", value: "67", unit: "%", change: 3.2, color: "#FFBB28" },
    { id: "time", name: "Time to First Response", value: "45", unit: "sec", change: -12.5, color: "#00C49F" },
    { id: "open", name: "Message Open Rate", value: "94", unit: "%", change: 1.5, color: "#0088FE" },
    { id: "ctr", name: "Click-Through Rate", value: "42", unit: "%", change: 2.8, color: "#FF8042" }
  ],
  retention: [
    { id: "csat", name: "Customer Satisfaction", value: "4.7", unit: "/5", change: 0.2, color: "#0088FE" },
    { id: "repeat", name: "Repeat Interaction Rate", value: "58", unit: "%", change: 4.1, color: "#00C49F" },
    { id: "churn", name: "Churn Rate", value: "12", unit: "%", change: -2.5, color: "#FF8042" },
    { id: "reengagement", name: "Re-engagement Rate", value: "34", unit: "%", change: 5.6, color: "#FFBB28" }
  ],
  conversion: [
    { id: "conversion", name: "Conversion Rate", value: "12.4", unit: "%", change: 1.8, color: "#FF8042" },
    { id: "lead", name: "Lead Engagement Rate", value: "36", unit: "%", change: 2.2, color: "#0088FE" },
    { id: "acquisition", name: "Contact Acquisition", value: "145", unit: "", change: 12.5, color: "#00C49F" },
    { id: "attribution", name: "Attribution Score", value: "68", unit: "%", change: 3.4, color: "#FFBB28" }
  ]
};

// Define TypeScript interface for KPI Card props
interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change: number;
  color: string;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock data loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
      {/* Enhanced Dashboard Header */}
      <div className="border-b border-gray-200 pb-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500 max-w-4xl">
              Monitor your WhatsApp flow performance, track key metrics, and optimize your conversions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div
                className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-white text-sm font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Export</span>
                <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        toast({
                          title: "Exporting to CSV",
                          description: "Your data export has started"
                        });
                      }}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export as CSV
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        toast({
                          title: "Exporting to PDF",
                          description: "Your PDF is being generated"
                        });
                      }}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Export as PDF
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        toast({
                          title: "Exporting as Image",
                          description: "Your dashboard image is being prepared"
                        });
                      }}
                    >
                      <svg className="mr-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Export as Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-150"
              onClick={() => {
                toast({
                  title: "Generating report",
                  description: "Your full report is being prepared"
                });
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>

        {/* Flow Selection Bar */}
        <div className="mt-6 mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-700">Active Flow:</span>
            </div>
            <Select defaultValue="onboarding">
              <SelectTrigger className="w-[200px] border-gray-300 bg-white">
                <SelectValue placeholder="Select flow" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onboarding">Onboarding Flow</SelectItem>
                <SelectItem value="support">Customer Support</SelectItem>
                <SelectItem value="sales">Sales Funnel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Date Range:</span>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none">
              Last 7 days
            </button>
          </div>
        </div>
      </div>

      {/* Flow Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Onboarding Flow</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-2xl">
                WhatsApp flow that guides new users through the platform setup process
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-700">Active</span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated: <span className="font-medium text-gray-700">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-150"
              onClick={() => {
                toast({
                  title: "Opening flow editor",
                  description: "Redirecting to flow editor"
                });
              }}
            >
              <svg className="mr-1.5 h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Flow
            </button>
            <button
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-150"
              onClick={() => {
                toast({
                  title: "Creating A/B test",
                  description: "Setting up a new test for this flow"
                });
              }}
            >
              <svg className="mr-1.5 h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              New A/B Test
            </button>
            <button
              className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-150"
              onClick={() => {
                toast({
                  title: "Flow settings",
                  description: "Opening flow configuration"
                });
              }}
            >
              <svg className="mr-1.5 h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-50 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Views</dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">12,426</div>
                    <div className="mt-1 text-xs flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      8.2% vs last period
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-50 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completion Rate</dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">42.3%</div>
                    <div className="mt-1 text-xs flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      3.7% vs last period
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-purple-50 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg. Time to Complete</dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">2:05</div>
                    <div className="mt-1 text-xs flex items-center text-red-600">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                      </svg>
                      5.3% vs last period
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-yellow-50 p-3">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Satisfaction Score</dt>
                  <dd>
                    <div className="text-lg font-bold text-gray-900">4.2/5</div>
                    <div className="mt-1 text-xs flex items-center text-green-600">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      0.3 vs last period
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="space-y-6">
        {/* Analytics Tabs */}
        <Tabs
          defaultValue="overview"
          className="space-y-6"
        >
            <TabsList className="grid grid-cols-3 h-12">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="performance" className="text-sm">Flow Performance</TabsTrigger>
              <TabsTrigger value="ab-testing" className="text-sm">A/B Testing</TabsTrigger>
            </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Flow Performance Card */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Flow Performance</CardTitle>
                  <CardDescription>Performance trends over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { date: 'Mon', completion: 38, views: 85, response: 56 },
                            { date: 'Tue', completion: 42, views: 92, response: 61 },
                            { date: 'Wed', completion: 47, views: 102, response: 64 },
                            { date: 'Thu', completion: 40, views: 89, response: 58 },
                            { date: 'Fri', completion: 44, views: 95, response: 62 },
                            { date: 'Sat', completion: 37, views: 80, response: 54 },
                            { date: 'Sun', completion: 42, views: 94, response: 61 },
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                          <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            name="Views"
                            activeDot={{ r: 6, stroke: '#82ca9d', strokeWidth: 1, fill: '#fff' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="response"
                            stroke="#ffc658"
                            fillOpacity={1}
                            fill="url(#colorResponse)"
                            name="Response Rate"
                            activeDot={{ r: 6, stroke: '#ffc658', strokeWidth: 1, fill: '#fff' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="completion"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorCompletion)"
                            name="Completion"
                            activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 1, fill: '#fff' }}
                          />
                          <Legend verticalAlign="top" height={36} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* KPI Categories Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>KPI Categories</CardTitle>
                  <CardDescription>Flow performance by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-600">Completion</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className="text-gray-900">42%</span>
                          <span className="ml-1 text-xs text-green-600">+3.7%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-600">Open Rate</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className="text-gray-900">89%</span>
                          <span className="ml-1 text-xs text-green-600">+5.2%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-600">Response Rate</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className="text-gray-900">61%</span>
                          <span className="ml-1 text-xs text-green-600">+2.3%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-yellow-500 rounded-full" style={{ width: "61%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-600">Conversion</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className="text-gray-900">24%</span>
                          <span className="ml-1 text-xs text-red-600">-1.8%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-purple-500 rounded-full" style={{ width: "24%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-600">Satisfaction</div>
                        <div className="text-sm font-medium flex items-center">
                          <span className="text-gray-900">4.2/5</span>
                          <span className="ml-1 text-xs text-green-600">+0.3</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-orange-500 rounded-full" style={{ width: "84%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conversion Funnel Analysis */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Funnel Analysis</CardTitle>
                <CardDescription>Track user progression through your onboarding flow</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-80 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Key Metrics Banner - Moved to top */}
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-center shadow-sm">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold text-gray-700">Initial Audience</span>
                        </div>
                        <p className="text-xl font-bold text-blue-700">1,000</p>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-center shadow-sm">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold text-gray-700">Total Drop-off</span>
                        </div>
                        <p className="text-xl font-bold text-red-700">58%</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center shadow-sm">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-bold text-gray-700">Conversion Rate</span>
                        </div>
                        <p className="text-xl font-bold text-green-700">42%</p>
                      </div>
                    </div>

                    {/* Date Range Filter Row */}
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 font-medium">Date Range:</span>
                        <Select defaultValue="7days">
                          <SelectTrigger className="h-8 w-[150px] border-gray-300 bg-white text-xs">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7days">Last 7 days</SelectItem>
                            <SelectItem value="30days">Last 30 days</SelectItem>
                            <SelectItem value="90days">Last 90 days</SelectItem>
                            <SelectItem value="custom">Custom range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1 px-2 py-1 rounded">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>Filter Options</span>
                      </button>
                    </div>

                    {/* Enhanced Funnel Visualization with consistent shape and gradients */}
                    <div className="relative h-80">
                      {/* Funnel steps with improved styling and data */}
                      <div className="absolute inset-0 flex flex-col space-y-4 py-6 pointer-events-none">
                        {[
                          {
                            name: 'Impressions',
                            value: 1000,
                            percent: 100,
                            color: 'bg-blue-500',
                            time: '0s',
                            retention: '100%',
                            dropoff: '0%',
                            description: 'Users who saw your flow'
                          },
                          {
                            name: 'Flow Started',
                            value: 850,
                            percent: 85,
                            color: 'bg-teal-400',
                            time: '5s',
                            retention: '85%',
                            dropoff: '15%',
                            description: 'Users who began the flow'
                          },
                          {
                            name: 'Step 1 Complete',
                            value: 720,
                            percent: 72,
                            color: 'bg-green-400',
                            time: '10s',
                            retention: '72%',
                            dropoff: '13%',
                            description: 'Users who completed step 1'
                          },
                          {
                            name: 'Step 2 Complete',
                            value: 580,
                            percent: 58,
                            color: 'bg-yellow-400',
                            time: '18s',
                            retention: '58%',
                            dropoff: '14%',
                            description: 'Users who completed step 2'
                          },
                          {
                            name: 'Step 3 Complete',
                            value: 480,
                            percent: 48,
                            color: 'bg-orange-400',
                            time: '35s',
                            retention: '48%',
                            dropoff: '10%',
                            description: 'Users who completed step 3'
                          },
                          {
                            name: 'Flow Complete',
                            value: 420,
                            percent: 42,
                            color: 'bg-red-400',
                            time: '15s',
                            retention: '42%',
                            dropoff: '6%',
                            description: 'Users who finished the entire flow'
                          }
                        ].map((step, index, array) => {
                          const maxWidth = 65;
                          const minWidth = 40;
                          const widthPercent = maxWidth - (index * (maxWidth - minWidth) / (array.length - 1));

                          return (
                            <div key={index} className="flex items-center h-8">
                              {/* Step label and time on left side */}
                              <div className="flex items-center w-[180px]">
                                <div className="flex-1 text-right mr-2">
                                  <div className="text-sm font-medium text-gray-900 whitespace-nowrap">{step.name}</div>
                                </div>
                                <div className="flex items-center text-gray-500 w-8">
                                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-xs">{step.time}</span>
                                </div>
                              </div>

                              {/* Funnel bar */}
                              <div
                                className={`h-8 ${step.color} rounded flex items-center justify-center`}
                                style={{ width: `${widthPercent}%` }}
                              >
                                <div className="text-xs font-medium text-white">
                                  {step.retention}
                                  {index > 0 && (
                                    <span className="ml-1 text-white bg-black bg-opacity-30 rounded px-1">
                                      -{step.dropoff}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* User count on right side */}
                              <div className="ml-3 flex flex-col">
                                <span className="text-sm font-medium text-gray-900">{step.value}</span>
                                {index > 0 && (
                                  <span className="text-xs text-red-500">
                                    -{Math.round((1 - step.value / array[index - 1].value) * 100)}%
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step-by-Step Analysis */}
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                      <h3 className="text-sm font-bold text-gray-700 mb-3">Key Insights</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-red-500">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="ml-2 text-gray-700">
                            <span className="font-medium">Highest drop-off (15%)</span> occurs at the <span className="font-medium">first step</span>, indicating potential issues with initial engagement.
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-yellow-500">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="ml-2 text-gray-700">
                            <span className="font-medium">Step 2</span> takes the longest time to complete (18s), which may contribute to its 14% drop-off rate.
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="ml-2 text-gray-700">
                            <span className="font-medium">Completion rate (42%)</span> is above industry average of 38%, showing good overall retention.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhancement Suggestions */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                        <svg className="h-4 w-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Suggested Optimizations
                      </h3>
                      <div className="space-y-1 text-xs text-gray-700">
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-1">•</span>
                          Simplify the initial step to improve the 15% drop-off rate.
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-1">•</span>
                          Consider breaking Step 2 (18s completion time) into smaller steps.
                        </p>
                        <p className="flex items-start">
                          <span className="text-blue-600 mr-1">•</span>
                          Add more engagement elements in Step 3 to reduce the 10% drop-off.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flow Performance Tab Content */}
          <TabsContent value="performance" className="space-y-6">
            {/* Step-by-Step Flow Analysis - Enhanced with Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Flow Performance Funnel</CardTitle>
                <CardDescription>Visualize how users progress through your WhatsApp flow</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {/* Funnel Chart Visualization */}
                <div className="h-72 mb-6">
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={[
                          { stage: "Start", value: 100, users: 1000, color: "#60a5fa" },
                          { stage: "Step 1", value: 85, users: 850, color: "#34d399" },
                          { stage: "Step 2", value: 72, users: 720, color: "#a78bfa" },
                          { stage: "Step 3", value: 58, users: 580, color: "#f97316" },
                          { stage: "Completion", value: 42, users: 420, color: "#8b5cf6" }
                        ]}
                        margin={{ top: 10, right: 50, left: 120, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <YAxis
                          dataKey="stage"
                          type="category"
                          width={100}
                          tick={{ fill: '#4b5563', fontSize: 14 }}
                        />
                        <RechartsTooltip
                          formatter={(value: number, name: string, props: any) => {
                            return [`${value}% (${props.payload.users} users)`, 'Completion Rate'];
                          }}
                          labelFormatter={(label) => `Stage: ${label}`}
                          contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar
                          dataKey="value"
                          barSize={36}
                          radius={[0, 6, 6, 0]}
                          animationDuration={1500}
                        >
                          {/* Custom color for each stage of the funnel */}
                          {[
                            { stage: "Start", value: 100, users: 1000, color: "#60a5fa" },
                            { stage: "Step 1", value: 85, users: 850, color: "#34d399" },
                            { stage: "Step 2", value: 72, users: 720, color: "#a78bfa" },
                            { stage: "Step 3", value: 58, users: 580, color: "#f97316" },
                            { stage: "Completion", value: 42, users: 420, color: "#8b5cf6" }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Flow Statistics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                    <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                    <p className="text-2xl font-bold text-blue-600">1,000</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                    <h3 className="text-sm font-medium text-gray-600">Completion Rate</h3>
                    <p className="text-2xl font-bold text-green-600">42%</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                    <h3 className="text-sm font-medium text-gray-600">Avg. Time to Complete</h3>
                    <p className="text-2xl font-bold text-yellow-600">2:05</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 text-center">
                    <h3 className="text-sm font-medium text-gray-600">Satisfaction Score</h3>
                    <p className="text-2xl font-bold text-purple-600">4.2/5</p>
                  </div>
                </div>

                {/* Step Details - Accordion Style */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Step-by-Step Details</h3>

                  {['Start', 'Step 1', 'Step 2', 'Step 3', 'Completion'].map((step, index) => {
                    // Define color coding based on drop-off rates
                    const dropoffRate = index === 0 ? 15 : index === 1 ? 15 : index === 2 ? 19 : index === 3 ? 28 : 0;
                    const dropoffColor = dropoffRate < 10 ? 'text-green-600' : dropoffRate < 20 ? 'text-yellow-600' : 'text-red-600';

                    // Define step color
                    const stepColors = ["#60a5fa", "#34d399", "#a78bfa", "#f97316", "#8b5cf6"];

                    return (
                      <div
                        key={step}
                        className={`bg-white p-5 rounded-lg border-l-4 transition-all hover:shadow-md`}
                        style={{ borderLeftColor: stepColors[index] }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div
                              className="flex items-center justify-center w-8 h-8 rounded-full text-white font-medium text-sm shadow-sm"
                              style={{ backgroundColor: stepColors[index] }}
                            >
                              {index + 1}
                            </div>
                            <h3 className="ml-3 font-medium text-gray-800">{step}</h3>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium" style={{ color: stepColors[index] }}>
                              {index === 0 ? '100%' : index === 1 ? '85%' : index === 2 ? '72%' : index === 3 ? '58%' : '42%'}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              ({index === 0 ? '1000' : index === 1 ? '850' : index === 2 ? '720' : index === 3 ? '580' : '420'} users)
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">Time Spent</div>
                              <div className="font-medium flex items-center space-x-1">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>{index === 0 ? '10s' : index === 1 ? '25s' : index === 2 ? '40s' : index === 3 ? '35s' : '15s'} avg.</span>
                              </div>
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-1.5 bg-blue-500 rounded-full"
                                style={{
                                  width: `${index === 0 ? 25 : index === 1 ? 62.5 : index === 2 ? 100 : index === 3 ? 87.5 : 37.5}%`
                                }}
                              />
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">Drop-off Rate</div>
                              <div className={`font-medium flex items-center space-x-1 ${(() => {
                                  const rate = index === 0 ? 15 : index === 1 ? 15 : index === 2 ? 19 : index === 3 ? 28 : 0;
                                  return rate < 10 ? 'text-green-600' : rate < 20 ? 'text-yellow-600' : 'text-red-600';
                                })()
                                }`}>
                                {(() => {
                                  const rate = index === 0 ? 15 : index === 1 ? 15 : index === 2 ? 19 : index === 3 ? 28 : 0;
                                  return rate > 0 ? (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                  );
                                })()}
                                <span>{index === 0 ? '15%' : index === 1 ? '15%' : index === 2 ? '19%' : index === 3 ? '28%' : '0%'}</span>
                              </div>
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full ${(() => {
                                    const rate = index === 0 ? 15 : index === 1 ? 15 : index === 2 ? 19 : index === 3 ? 28 : 0;
                                    return rate < 10 ? 'bg-green-500' : rate < 20 ? 'bg-yellow-500' : 'bg-red-500';
                                  })()
                                  }`}
                                style={{ width: `${index === 0 ? 15 : index === 1 ? 15 : index === 2 ? 19 : index === 3 ? 28 : 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500">User Satisfaction</div>
                              <div className="font-medium flex items-center text-orange-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-4 h-4 ${star <= Math.floor(index === 0 ? 4.2 : index === 1 ? 4.3 : index === 2 ? 4.1 : index === 3 ? 3.9 : 4.5)
                                      ? 'text-orange-500'
                                      : star <= (index === 0 ? 4.2 : index === 1 ? 4.3 : index === 2 ? 4.1 : index === 3 ? 3.9 : 4.5)
                                        ? 'text-orange-500 fill-half'
                                        : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.828 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                <span className="ml-1">
                                  {index === 0 ? '4.2' : index === 1 ? '4.3' : index === 2 ? '4.1' : index === 3 ? '3.9' : '4.5'}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-1.5 bg-orange-500 rounded-full"
                                style={{
                                  width: `${(index === 0 ? 4.2 : index === 1 ? 4.3 : index === 2 ? 4.1 : index === 3 ? 3.9 : 4.5) * 20}%`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* A/B Testing Tab Content */}
          <TabsContent value="ab-testing" className="space-y-6">
            {/* A/B Testing section */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>A/B Testing</CardTitle>
                  <CardDescription>Compare performance of different variants</CardDescription>
                </div>
                <Select defaultValue="cta-button-test">
                  <SelectTrigger className="w-full sm:w-auto max-w-xs">
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Active Tests</SelectLabel>
                      <SelectItem value="cta-button-test">CTA Button Text Test</SelectItem>
                      <SelectItem value="welcome-message-test">Welcome Message Test</SelectItem>
                      <SelectItem value="response-options-test">Response Options Test</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {/* Test Overview */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Running for 7 days
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      2,468 participants
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      95% confidence
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">CTA Button Text Test</h3>
                  <p className="text-sm text-gray-500">Testing different call-to-action button texts to optimize conversion</p>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Control Group */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-800">Variant A (Control)</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          1,234 users
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Button text: "Sign Up"</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                          <p className="text-xl font-bold text-blue-600">10.2%</p>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Avg. Time</p>
                          <p className="text-xl font-bold text-blue-600">2:15</p>
                        </div>
                      </div>

                      {/* Metrics with visualizations */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Click Rate</span>
                            <span className="text-sm font-medium text-gray-900">24.5%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "24.5%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                            <span className="text-sm font-medium text-gray-900">10.2%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: "10.2%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Drop-off Rate</span>
                            <span className="text-sm font-medium text-gray-900">58.4%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-red-500 rounded-full" style={{ width: "58.4%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Variant */}
                  <div className="bg-white rounded-lg border border-green-200 overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-800">Variant B</h3>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Winner
                          </span>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          1,234 users
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Button text: "Try for Free"</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                          <div className="flex items-center">
                            <p className="text-xl font-bold text-green-600">12.4%</p>
                            <span className="ml-1 text-xs font-medium text-green-600 flex items-center">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                              21.6%
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-4">
                          <p className="text-xs text-gray-500 mb-1">Avg. Time</p>
                          <div className="flex items-center">
                            <p className="text-xl font-bold text-green-600">2:02</p>
                            <span className="ml-1 text-xs font-medium text-green-600 flex items-center">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              -5.8%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics with visualizations */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Click Rate</span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">31.2%</span>
                              <span className="ml-1 text-xs font-medium text-green-600">+6.7%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: "31.2%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">12.4%</span>
                              <span className="ml-1 text-xs font-medium text-green-600">+2.2%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-green-500 rounded-full" style={{ width: "12.4%" }}></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">Drop-off Rate</span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">46.1%</span>
                              <span className="ml-1 text-xs font-medium text-green-600">-12.3%</span>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-2 bg-red-500 rounded-full" style={{ width: "46.1%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Recommendation</h3>
                      <div className="mt-1 text-sm text-green-700">
                        <p>Variant B "Try for Free" outperforms the control group with a <strong>21.6% higher conversion rate</strong>. We recommend implementing this variant for all users.</p>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" className="bg-white hover:bg-green-50 text-green-700 border-green-300">
                          Apply Winner to All Users
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Results Graph */}
                <div className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Daily Conversion Rate Trend</h3>
                    <p className="text-sm text-gray-500">7-day performance comparison</p>
                  </div>

                  <div className="h-72 w-full">
                    {isLoading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <Skeleton className="h-full w-full" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { day: 'Mon', controlRate: 9.8, variantRate: 10.2 },
                            { day: 'Tue', controlRate: 9.9, variantRate: 11.5 },
                            { day: 'Wed', controlRate: 10.3, variantRate: 12.1 },
                            { day: 'Thu', controlRate: 10.1, variantRate: 12.3 },
                            { day: 'Fri', controlRate: 10.5, variantRate: 12.8 },
                            { day: 'Sat', controlRate: 10.4, variantRate: 13.5 },
                            { day: 'Sun', controlRate: 10.2, variantRate: 12.4 },
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <YAxis
                            tickFormatter={(value) => `${value}%`}
                            domain={[8, 15]}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                          />
                          <RechartsTooltip
                            formatter={(value: number) => [`${value}%`, '']}
                            contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                          />
                          <Line
                            type="monotone"
                            dataKey="controlRate"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ fill: '#3b82f6', r: 4 }}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }}
                            name="Control (Sign Up)"
                          />
                          <Line
                            type="monotone"
                            dataKey="variantRate"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                            activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                            name="Variant (Try for Free)"
                          />
                          <Legend />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add CSS fixes */}
      <style jsx global>{`
        [data-radix-popper-content-wrapper] {
          z-index: 9999 !important;
        }
        
        .radix-dropdown-menu-content {
          isolation: isolate;
        }
        
        body {
          overflow-x: hidden;
        }
        
        /* Position fixed for all dropdown content */
        [data-radix-popper-content-wrapper] {
          position: absolute !important;
        }

        /* Make sure dropdowns have solid background */
        .Select-menu-outer,
        .dropdown-content,
        [role="listbox"],
        [role="menu"] {
          background-color: white !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
          border: 1px solid #e5e7eb !important;
        }
      `}</style>
    </div>
  );
} 