"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function AnalyticsPage() {
  // API Request data
  const requestData = [
    { time: "00:00", requests: 1200, errors: 12 },
    { time: "04:00", requests: 800, errors: 8 },
    { time: "08:00", requests: 2400, errors: 24 },
    { time: "12:00", requests: 3200, errors: 45 },
    { time: "16:00", requests: 2800, errors: 32 },
    { time: "20:00", requests: 1800, errors: 18 },
  ];

  // Response time data
  const responseTimeData = [
    { endpoint: "/api/users", avgTime: 45, p95: 120, p99: 250 },
    { endpoint: "/api/auth", avgTime: 32, p95: 85, p99: 180 },
    { endpoint: "/api/products", avgTime: 78, p95: 180, p99: 420 },
    { endpoint: "/api/orders", avgTime: 125, p95: 280, p99: 650 },
    { endpoint: "/api/reports", avgTime: 340, p95: 820, p99: 1200 },
  ];

  // Status codes distribution
  const statusCodeData = [
    { name: "200 OK", value: 85.5, color: "#10b981" },
    { name: "201 Created", value: 8.2, color: "#3b82f6" },
    { name: "400 Bad Request", value: 3.1, color: "#f59e0b" },
    { name: "401 Unauthorized", value: 2.2, color: "#ef4444" },
    { name: "500 Server Error", value: 1.0, color: "#dc2626" },
  ];

  // Top endpoints by usage
  const topEndpointsData = [
    { endpoint: "/api/auth/login", calls: 45230 },
    { endpoint: "/api/users", calls: 32450 },
    { endpoint: "/api/products", calls: 28900 },
    { endpoint: "/api/auth/me", calls: 24560 },
    { endpoint: "/api/orders", calls: 18720 },
  ];

  // Error rate over time
  const errorRateData = [
    { day: "Mon", rate: 1.2 },
    { day: "Tue", rate: 0.8 },
    { day: "Wed", rate: 1.5 },
    { day: "Thu", rate: 0.9 },
    { day: "Fri", rate: 2.1 },
    { day: "Sat", rate: 0.7 },
    { day: "Sun", rate: 0.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">API middleware performance and usage metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Requests (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4K</div>
            <p className="text-xs text-green-600 mt-1">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84ms</div>
            <p className="text-xs text-green-600 mt-1">-8ms from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2%</div>
            <p className="text-xs text-red-600 mt-1">+0.3% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-gray-500 mt-1">Currently online</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* API Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle>API Requests & Errors</CardTitle>
            <CardDescription>
              Request volume and error count over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={requestData}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="time"
                  className="text-xs"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRequests)"
                  strokeWidth={2}
                  name="Requests"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorErrors)"
                  strokeWidth={2}
                  name="Errors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time by Endpoint</CardTitle>
            <CardDescription>
              Average, P95, and P99 response times (ms)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="endpoint"
                  className="text-xs"
                  tick={{ fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="avgTime" fill="#10b981" name="Avg" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p95" fill="#3b82f6" name="P95" radius={[4, 4, 0, 0]} />
                <Bar dataKey="p99" fill="#8b5cf6" name="P99" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Rate Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Error Rate Trend</CardTitle>
            <CardDescription>
              Daily error rate percentage over the last week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={errorRateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis
                  dataKey="day"
                  className="text-xs"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: '#6b7280' }}
                  label={{ value: '%', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Error Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Codes Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>HTTP Status Codes</CardTitle>
            <CardDescription>
              Distribution of response status codes (%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusCodeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusCodeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {statusCodeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Endpoints Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top API Endpoints</CardTitle>
          <CardDescription>Most frequently called endpoints in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEndpointsData.map((endpoint, index) => (
              <div key={endpoint.endpoint} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    #{index + 1}
                  </Badge>
                  <span className="font-mono text-sm">{endpoint.endpoint}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{endpoint.calls.toLocaleString()} calls</div>
                  <div className="text-xs text-gray-500">
                    {((endpoint.calls / 12400) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
