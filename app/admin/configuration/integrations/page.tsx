"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Server, ChevronRight, BarChart3, Truck, Database, FolderInput, Globe, FolderArchive } from "lucide-react";
import { AmazonIcon } from "@/components/icons/amazon-icon";

interface IntegrationService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const integrationServices: IntegrationService[] = [
  {
    id: "email",
    name: "Email Service",
    description: "SMTP configuration for sending emails",
    icon: <Mail className="h-6 w-6" />,
    href: "/admin/configuration/integrations/email",
  },
  {
    id: "unite",
    name: "Unite EDI",
    description: "FTP and EDI configuration for Unite integration",
    icon: <Server className="h-6 w-6" />,
    href: "/admin/configuration/integrations/unite",
  },
  {
    id: "amazon",
    name: "Amazon SP-API",
    description: "Amazon Seller Partner API credentials for all accounts",
    icon: <AmazonIcon className="h-6 w-6" />,
    href: "/admin/configuration/integrations/amazon",
  },
  {
    id: "sellerlogic",
    name: "SellerLogic",
    description: "SellerLogic API credentials for repricing and analytics",
    icon: <BarChart3 className="h-6 w-6" />,
    href: "/admin/configuration/integrations/sellerlogic",
  },
  {
    id: "dhl",
    name: "DHL",
    description: "DHL API credentials for tracking and shipping",
    icon: <Truck className="h-6 w-6" />,
    href: "/admin/configuration/integrations/dhl",
  },
  {
    id: "itscope",
    name: "ITScope",
    description: "ITScope API credentials for order processing",
    icon: <Database className="h-6 w-6" />,
    href: "/admin/configuration/integrations/itscope",
  },
  {
    id: "conrad",
    name: "Conrad",
    description: "Conrad file import and export locations",
    icon: <FolderInput className="h-6 w-6" />,
    href: "/admin/configuration/integrations/conrad",
  },
  {
    id: "digitec",
    name: "Digitec",
    description: "Digitec product update file locations",
    icon: <FolderInput className="h-6 w-6" />,
    href: "/admin/configuration/integrations/digitec",
  },
  {
    id: "sap",
    name: "SAP Business One",
    description: "SAP Service Layer API connection settings",
    icon: <Globe className="h-6 w-6" />,
    href: "/admin/configuration/integrations/sap",
  },
  {
    id: "sql",
    name: "SQL Server",
    description: "SQL Server database connection settings",
    icon: <Database className="h-6 w-6" />,
    href: "/admin/configuration/integrations/sql",
  },
  {
    id: "middleware",
    name: "Middleware",
    description: "Middleware archive location settings",
    icon: <FolderArchive className="h-6 w-6" />,
    href: "/admin/configuration/integrations/middleware",
  },
];

export default function IntegrationsConfiguration() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Integrations</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Connect and configure third-party services
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Total Integrations</CardDescription>
            <CardTitle className="text-2xl md:text-3xl">{integrationServices.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-4 md:p-6 pb-3">
            <CardDescription className="text-xs md:text-sm">Active Services</CardDescription>
            <CardTitle className="text-2xl md:text-3xl text-green-600">
              {integrationServices.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Integration Services Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrationServices.map((service) => (
            <Link key={service.id} href={service.href}>
              <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer h-full">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {service.icon}
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <CardTitle className="text-base md:text-lg mt-4">{service.name}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                  <div className="flex items-center text-sm text-primary font-medium">
                    Configure
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
