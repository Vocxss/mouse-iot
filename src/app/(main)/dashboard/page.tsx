import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row gap-4 min-h-full">
      <div className="flex flex-col gap-4 md:w-3/4 py-4 md:pr-4 md:border-r-2 w-full">
        <h2 className="font-bold text-lg">Device Status</h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
          <Card className="font-bold p-4 bg-cyan-400">
            <h1>
              ESP32-Wroom:{" "}
              <span className="font-bold text-white">Connected</span>{" "}
            </h1>
          </Card>
          <Card className="font-bold p-4 bg-red-400">
            <h1>
              ESP32-Cam:{" "}
              <span className="font-bold text-white">Connected</span>{" "}
            </h1>
          </Card>
          <Card className="font-bold p-4 bg-amber-400">
            <h1>
              Firebase:{" "}
              <span className="font-bold text-white">Connected</span>{" "}
            </h1>
          </Card>
        </div>
      </div>
      <div className="flex flex-col gap-4 py-4 md:w-1/4 w-full">
        <p className="font-bold text-lg">Latest Snapshots</p>
        <div className="min-h-60 border-2 rounded-lg bg-secondary-background p-4" />
        <Button>
          <Link href={"/camera"} className="font-bold text-sm">
            See all Snapshots
          </Link>
        </Button>
      </div>
    </div>
  );
}
