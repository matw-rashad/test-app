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
import Link from "next/link";

// Example product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    price: 79.99,
    stock: 125,
    status: "active",
    addedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Laptop Stand",
    sku: "LS-002",
    category: "Accessories",
    price: 34.99,
    stock: 78,
    status: "active",
    addedDate: "2024-02-10",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    sku: "MK-003",
    category: "Electronics",
    price: 129.99,
    stock: 0,
    status: "out_of_stock",
    addedDate: "2024-01-20",
  },
  {
    id: 4,
    name: "USB-C Hub",
    sku: "UC-004",
    category: "Accessories",
    price: 49.99,
    stock: 45,
    status: "active",
    addedDate: "2024-03-05",
  },
  {
    id: 5,
    name: "Ergonomic Mouse",
    sku: "EM-005",
    category: "Electronics",
    price: 59.99,
    stock: 15,
    status: "low_stock",
    addedDate: "2024-02-28",
  },
  {
    id: 6,
    name: "Monitor Arm",
    sku: "MA-006",
    category: "Accessories",
    price: 89.99,
    stock: 32,
    status: "active",
    addedDate: "2024-01-25",
  },
];

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
    active: { variant: "outline", className: "bg-green-50 text-green-700 border-green-200" },
    out_of_stock: { variant: "outline", className: "bg-red-50 text-red-700 border-red-200" },
    low_stock: { variant: "outline", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    discontinued: { variant: "outline", className: "bg-gray-50 text-gray-700 border-gray-200" },
  };

  const labels: Record<string, string> = {
    active: "Active",
    out_of_stock: "Out of Stock",
    low_stock: "Low Stock",
    discontinued: "Discontinued",
  };

  const config = variants[status] || variants.active;
  return (
    <Badge variant={config.variant} className={config.className}>
      {labels[status] || status}
    </Badge>
  );
}

export default function ProductsPage() {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const outOfStock = products.filter((p) => p.status === "out_of_stock").length;
  const lowStock = products.filter((p) => p.status === "low_stock").length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/add">
          <Button>Add Product</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Low/Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock + lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>A list of all products in your catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">{product.sku}</TableCell>
                  <TableCell className="text-gray-600">{product.category}</TableCell>
                  <TableCell className="font-medium">${product.price}</TableCell>
                  <TableCell className="text-gray-600">{product.stock}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
