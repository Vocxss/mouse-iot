"use client";

import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  Cctv,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  LogOut,
  Map,
  MoreHorizontal,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareActivity,
  SquareTerminal,
  Thermometer,
  Trash2,
} from "lucide-react";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Breadcrumb } from "@/components/retroui/Breadcrumb";
import { usePathname } from "next/navigation";
import { Card } from "@/components/retroui/Card";

const navMain = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: <LayoutDashboard className="size-5!" />,
    isActive: true,
  },
  {
    title: "Camera",
    url: "camera",
    icon: <Cctv className="size-5!" />,
    isActive: true,
  },
  {
    title: "Temperature",
    url: "temp",
    icon: <Thermometer className="size-5!" />,
    isActive: true,
  },
];

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPage = pathname?.split("/")[1];

  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-5">
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard" className="flex gap-2 items-center">
              <span>
                <SquareActivity className="size-6!" />
              </span>
              <span className="font-heading font-bold text-lg">Mouse IoT</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => {
              const isActive =
                currentPage?.toLowerCase() === item.url.toLowerCase();
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="data-[state=open]:bg-main data-[state=open]:outline-border data-[state=open]:text-main-foreground"
                    tooltip={item.title}
                  >
                    <Link
                      className="flex gap-4 item-center"
                      href={`/${item.url}`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer text-red-500 data-[state=open]:bg-main data-[state=open]:outline-border data-[state=open]:text-main-foreground"
            tooltip={"Logout"}
          >
            <LogOut className="size-5!" />
            <p className="font-heading font-bold">Logout</p>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentPage = pathname.split("/")[1];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full bg-background border-2 py-2 shadow">
            <SidebarTrigger className="-ml-1 bg-accent cursor-pointer" />
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item className="hidden md:block">
                  <Breadcrumb.Link href="/dashboard">Mouse Iot</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator className="hidden md:block" />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>
                    {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
                  </Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          </div>
        </header>
        <Card className="flex flex-1 flex-col gap-4 px-4">{children}</Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
