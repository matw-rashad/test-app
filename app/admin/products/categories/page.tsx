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

// Example category data
const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    productCount: 125,
    status: "active",
    description: "Electronic devices and accessories",
    createdDate: "2024-01-10",
  },
  {
    id: 2,
    name: "Accessories",
    slug: "accessories",
    productCount: 78,
    status: "active",
    description: "Computer and desk accessories",
    createdDate: "2024-01-15",
  },
  {
    id: 3,
    name: "Furniture",
    slug: "furniture",
    productCount: 45,
    status: "active",
    description: "Office furniture and equipment",
    createdDate: "2024-02-01",
  },
  {
    id: 4,
    name: "Software",
    slug: "software",
    productCount: 32,
    status: "active",
    description: "Software licenses and subscriptions",
    createdDate: "2024-02-15",
  },
  {
    id: 5,
    name: "Networking",
    slug: "networking",
    productCount: 28,
    status: "active",
    description: "Network equipment and cables",
    createdDate: "2024-03-01",
  },
  {
    id: 6,
    name: "Vintage",
    slug: "vintage",
    productCount: 5,
    status: "inactive",
    description: "Discontinued vintage items",
    createdDate: "2024-01-05",
  },
];

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; className: string }> = {
    active: { variant: "outline", className: "bg-green-50 text-green-700 border-green-200" },
    inactive: { variant: "outline", className: "bg-gray-50 text-gray-700 border-gray-200" },
  };

  const config = variants[status] || variants.active;
  return (
    <Badge variant={config.variant} className={config.className}>
      {status}
    </Badge>
  );
}

export default function CategoriesPage() {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === "active").length;
  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
          <p className="text-gray-500 mt-1">Organize and manage product categories</p>
        </div>
        <Button>Add Category</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCategories}</div>
          </CardContent>
        </Card>

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
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="font-medium">{category.name}</div>
                  </TableCell>
                  <TableCell className="text-gray-600">{category.slug}</TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {category.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{category.productCount}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(category.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View Products
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
