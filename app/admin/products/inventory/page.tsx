import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, TrendingUp, TrendingDown, Package } from "lucide-react";

// Example inventory data
const inventoryItems = [
  {
    id: 1,
    productName: "Wireless Headphones",
    sku: "WH-001",
    currentStock: 125,
    lowStockThreshold: 20,
    lastRestocked: "2024-03-01",
    stockStatus: "healthy",
    movement: "stable",
  },
  {
    id: 2,
    productName: "Laptop Stand",
    sku: "LS-002",
    currentStock: 78,
    lowStockThreshold: 15,
    lastRestocked: "2024-02-28",
    stockStatus: "healthy",
    movement: "increasing",
  },
  {
    id: 3,
    productName: "Mechanical Keyboard",
    sku: "MK-003",
    currentStock: 0,
    lowStockThreshold: 10,
    lastRestocked: "2024-02-15",
    stockStatus: "out_of_stock",
    movement: "decreasing",
  },
  {
    id: 4,
    productName: "USB-C Hub",
    sku: "UC-004",
    currentStock: 45,
    lowStockThreshold: 20,
    lastRestocked: "2024-03-10",
    stockStatus: "healthy",
    movement: "stable",
  },
  {
    id: 5,
    productName: "Ergonomic Mouse",
    sku: "EM-005",
    currentStock: 15,
    lowStockThreshold: 20,
    lastRestocked: "2024-02-20",
    stockStatus: "low_stock",
    movement: "decreasing",
  },
  {
    id: 6,
    productName: "Monitor Arm",
    sku: "MA-006",
    currentStock: 32,
    lowStockThreshold: 15,
    lastRestocked: "2024-03-05",
    stockStatus: "healthy",
    movement: "stable",
  },
  {
    id: 7,
    productName: "Webcam HD",
    sku: "WC-007",
    currentStock: 8,
    lowStockThreshold: 10,
    lastRestocked: "2024-01-30",
    stockStatus: "low_stock",
    movement: "decreasing",
  },
];

function getStockStatusBadge(status: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string; icon: React.ReactElement }> = {
    healthy: {
      variant: "outline",
      className: "bg-green-50 text-green-700 border-green-200",
      icon: <Package className="h-3 w-3" />,
    },
    low_stock: {
      variant: "outline",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
    out_of_stock: {
      variant: "outline",
      className: "bg-red-50 text-red-700 border-red-200",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
  };

  const labels: Record<string, string> = {
    healthy: "Healthy",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
  };

  const config = variants[status] || variants.healthy;
  return (
    <Badge variant={config.variant} className={`${config.className} flex items-center gap-1 w-fit`}>
      {config.icon}
      {labels[status] || status}
    </Badge>
  );
}

function getMovementIndicator(movement: string) {
  const indicators: Record<string, { icon: React.ReactElement; className: string }> = {
    increasing: {
      icon: <TrendingUp className="h-4 w-4" />,
      className: "text-green-600",
    },
    decreasing: {
      icon: <TrendingDown className="h-4 w-4" />,
      className: "text-red-600",
    },
    stable: {
      icon: <div className="h-4 w-4 flex items-center justify-center text-gray-600">—</div>,
      className: "text-gray-600",
    },
  };

  const config = indicators[movement] || indicators.stable;
  return <div className={config.className}>{config.icon}</div>;
}

export default function InventoryPage() {
  const totalItems = inventoryItems.length;
  const lowStockItems = inventoryItems.filter((item) => item.stockStatus === "low_stock").length;
  const outOfStockItems = inventoryItems.filter((item) => item.stockStatus === "out_of_stock").length;
  const totalStockValue = inventoryItems.reduce((sum, item) => sum + item.currentStock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Monitor and manage product stock levels</p>
        </div>
        <Button>Adjust Stock</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-gray-500 mt-1">Products tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Stock Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStockValue}</div>
            <p className="text-xs text-gray-500 mt-1">Units in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-gray-500 mt-1">Items need restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-gray-500 mt-1">Items unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Levels</CardTitle>
          <CardDescription>Current inventory status and stock movements</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Movement</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium">{item.productName}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.sku}</TableCell>
                  <TableCell>
                    <div className="font-semibold">{item.currentStock}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">{item.lowStockThreshold}</TableCell>
                  <TableCell>{getStockStatusBadge(item.stockStatus)}</TableCell>
                  <TableCell>{getMovementIndicator(item.movement)}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(item.lastRestocked).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Adjust
                      </Button>
                      <Button variant="outline" size="sm">
                        History
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stock Alerts */}
      {(lowStockItems > 0 || outOfStockItems > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Stock Alerts
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Action required for items with low or no stock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outOfStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">
                        {outOfStockItems} product{outOfStockItems > 1 ? "s" : ""} out of stock
                      </p>
                      <p className="text-sm text-red-700">Immediate restocking required</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700">
                    View Items
                  </Button>
                </div>
              )}
              {lowStockItems > 0 && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        {lowStockItems} product{lowStockItems > 1 ? "s" : ""} running low
                      </p>
                      <p className="text-sm text-yellow-700">Consider restocking soon</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700">
                    View Items
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
