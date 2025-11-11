import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,543</div>
            <p className="text-xs text-green-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-green-600 mt-1">+20% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-gray-500 mt-1">+201 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-green-600 mt-1">+8% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "Created new account", time: "2 min ago", status: "success" },
                { user: "Jane Smith", action: "Updated profile", time: "15 min ago", status: "info" },
                { user: "Mike Johnson", action: "Deleted post", time: "1 hour ago", status: "warning" },
                { user: "Sarah Williams", action: "Uploaded files", time: "2 hours ago", status: "success" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.action}</p>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current system health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { service: "API Server", status: "operational", uptime: "99.9%" },
                { service: "Database", status: "operational", uptime: "99.8%" },
                { service: "Storage", status: "operational", uptime: "100%" },
                { service: "Email Service", status: "operational", uptime: "99.5%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.service}</p>
                    <p className="text-xs text-gray-500">Uptime: {item.uptime}</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
