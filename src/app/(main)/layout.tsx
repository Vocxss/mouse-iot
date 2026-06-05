"use client";

import {
  Cctv,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  SquareActivity,
  Thermometer,
} from "lucide-react";

import * as React from "react";

import { Avatar } from "@/components/retroui/Avatar";
import { Breadcrumb } from "@/components/retroui/Breadcrumb";
import { Card } from "@/components/retroui/Card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { app } from "@/lib/firebaseConfig";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/useSession";

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
  const router = useRouter();
  const currentPage = pathname?.split("/")[1];
  const user = getAuth(app).currentUser;
  const session = useSession();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    getAuth(app).signOut();
    router.push("/auth/login");
  };

  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="py-5">
        <SidebarMenuItem>
          <Card>
            <SidebarMenuButton className="bg-accent" asChild>
              <Link href="/dashboard" className="flex gap-2 items-center">
                <span>
                  <SquareActivity className="size-6!" />
                </span>
                <span className="font-heading font-bold text-lg">
                  Mouse IoT
                </span>
              </Link>
            </SidebarMenuButton>
          </Card>
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
      <SidebarMenuItem className="flex items-center gap-4 cursor-pointer border-t-2 p-4">
        <Avatar className="size-8 shrink-0">
          {session.user?.photoURL ? (
            <Avatar.Image src={session.user?.photoURL} />
          ) : (
            <Avatar.Fallback className="text-xs font-bold bg-accent text-black">
              {session.user?.displayName?.charAt(0).toUpperCase() ||
                session.user?.email?.charAt(0).toUpperCase() ||
                "U"}
            </Avatar.Fallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-1 min-w-0 group-data-[collapsible=icon]:hidden">
          <span className="font-heading font-bold text-sm truncate">
            {session.user?.displayName ||
              session.user?.email?.split("@")[0] ||
              "User"}
          </span>
          {session.user?.displayName && (
            <span className="text-xs text-muted-foreground truncate">
              {session.user?.email}
            </span>
          )}
          <p className="text-gray-500 text-xs font-bold">Admin</p>
        </div>
      </SidebarMenuItem>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer text-red-500 data-[state=open]:bg-main data-[state=open]:outline-border data-[state=open]:text-main-foreground"
            tooltip={"Logout"}
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
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
        <Card className="flex flex-1 flex-col gap-4">{children}</Card>
      </SidebarInset>
    </SidebarProvider>
  );
}
