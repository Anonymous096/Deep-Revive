"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="group/sidebar-wrapper">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen">
          <Sidebar variant="sidebar" collapsible="icon">
            <AppSidebar />
          </Sidebar>
          <main className="flex-1 overflow-y-auto">
            <header className="flex h-16 items-center gap-2 px-6 border-b">
              <SidebarTrigger className="-ml-2" />
              <Separator orientation="vertical" className="h-6" />
              {/* Breadcrumb will be rendered in the page */}
            </header>
            <div className="p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
