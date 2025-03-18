"use client";

import { Command } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: Command,
    },
    {
      title: "Revive and Relive",
      url: "/dashboard/revive",
      icon: Command,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Command,
    },
  ],
  projects: [
    {
      name: "Project 1",
      url: "/dashboard/project/1",
      icon: Command,
    },
    {
      name: "Project 2",
      url: "/dashboard/project/2",
      icon: Command,
    },
  ],
  navSecondary: [
    {
      title: "Help",
      url: "/help",
      icon: Command,
    },
    {
      title: "Documentation",
      url: "/docs",
      icon: Command,
    },
  ],
};

export function NavLinks() {
  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Deep Revive</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </>
  );
}
