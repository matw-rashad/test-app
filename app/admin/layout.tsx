"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type NavItem = {
  name: string;
  href?: string;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin" },
  { name: "Users", href: "/admin/users" },
  {
    name: "Products",
    children: [
      { name: "Product List", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/add" },
      { name: "Categories", href: "/admin/products/categories" },
      { name: "Inventory", href: "/admin/products/inventory" },
    ]
  },
  {
    name: "Configuration",
    children: [
      { name: "General", href: "/admin/configuration/general" },
      { name: "Security", href: "/admin/configuration/security" },
      { name: "Integrations", href: "/admin/configuration/integrations" },
      { name: "API Keys", href: "/admin/configuration/api-keys" },
    ]
  },
  { name: "Settings", href: "/admin/settings" },
  { name: "Analytics", href: "/admin/analytics" },
];

// Navigation item component
function NavigationItem({
  item,
  pathname,
  onNavClick,
  level = 0
}: {
  item: NavItem;
  pathname: string;
  onNavClick?: () => void;
  level?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = pathname === item.href;
  const isParentActive = hasChildren && item.children?.some(child => pathname === child.href);

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Button
          variant={isParentActive ? "secondary" : "ghost"}
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{item.name}</span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {isExpanded && (
          <div className="ml-3 space-y-1 border-l-2 border-gray-200 pl-2">
            {item.children.map((child) => (
              <NavigationItem
                key={child.href || child.name}
                item={child}
                pathname={pathname}
                onNavClick={onNavClick}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.href!} onClick={onNavClick}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        {item.name}
      </Button>
    </Link>
  );
}

// Sidebar content component for reuse
function SidebarContent({ pathname, onNavClick }: { pathname: string; onNavClick?: () => void }) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0">
        {navItems.map((item) => (
          <NavigationItem
            key={item.href || item.name}
            item={item}
            pathname={pathname}
            onNavClick={onNavClick}
          />
        ))}
      </nav>

      <Separator className="flex-shrink-0" />

      {/* User Profile */}
      <div className="p-4 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">Admin User</span>
                  <span className="text-xs text-gray-500">
                    admin@example.com
                  </span>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/login" className="w-full">
                Log out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 gap-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent pathname={pathname} onNavClick={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
