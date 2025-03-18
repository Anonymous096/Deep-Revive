"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/dashboard" className="hover:text-primary">
            Dashboard
          </Link>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
          <p className="text-muted-foreground">
            View your image enhancement statistics and usage.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">
            Check your recent image enhancements and restorations.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4">Storage</h2>
          <p className="text-muted-foreground">
            Monitor your storage usage and available space.
          </p>
        </Card>
      </div>
    </div>
  );
}
