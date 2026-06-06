"use client";
import { app } from "@/lib/firebaseConfig";
import { useSession } from "@/lib/useSession";
import { getAuth } from "firebase/auth";
import {
  Cctv,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  SquareActivity,
  Thermometer,
} from "lucide-react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "./retroui/Avatar";
import { Card } from "./retroui/Card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <NextLink href="/dashboard" className="flex gap-2 items-center">
                <span>
                  <SquareActivity className="size-6!" />
                </span>
                <span className="font-heading font-bold text-lg">
                  Mouse IoT
                </span>
              </NextLink>
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
                    <NextLink
                      className="flex gap-4 item-center"
                      href={`/${item.url}`}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </NextLink>
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
