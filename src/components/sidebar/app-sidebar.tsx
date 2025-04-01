"use client";

import * as React from "react";

import { SidebarFooter } from "@/components/ui/sidebar";
// import { NavMain } from "./nav-main";
// import { NavProjects } from "./nav-projects";
// import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { NavLinks } from "./nav-links";

export function AppSidebar() {
  return (
    <>
      <NavLinks />
      <SidebarFooter className="mb-8">
        <NavUser />
      </SidebarFooter>
    </>
  );
}
