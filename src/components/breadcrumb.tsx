"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "./retroui/Breadcrumb";

export const BreadcrumbComponent = () => {
  const pathname = usePathname();
  const currentPage = pathname.split("/")[1];
  return (
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
  );
};
