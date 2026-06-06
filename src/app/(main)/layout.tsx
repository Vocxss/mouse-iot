import { AppSidebar } from "@/components/appsidebar";
import { BreadcrumbComponent } from "@/components/breadcrumb";
import { Card } from "@/components/retroui/Card";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import * as React from "react";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full bg-background border-2 py-2 shadow">
            <SidebarTrigger className="-ml-1 bg-accent cursor-pointer" />
            <BreadcrumbComponent />
          </div>
        </header>
        <Card className="flex flex-1 flex-col gap-4">{children}</Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
