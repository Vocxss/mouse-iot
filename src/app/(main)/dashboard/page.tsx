import Link from "next/link";
import { Camera } from "@/components/camera";
import { Button } from "@/components/retroui/Button";
import { DeviceStatusSection } from "@/components/status";
import { MonitorCurrentHumid, MonitorCurrentTemp } from "@/components/temp";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-full">
      <div className="flex flex-col gap-8 md:w-3/4 py-4 md:border-r-2 w-full">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg pb-2 border-b-2 px-4">
            Device Status
          </h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 px-4">
            <DeviceStatusSection />
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <h2 className="text-lg font-bold border-t-2 pt-2 px-4">
            Environtment Data
          </h2>
          <div className="grid grid-cols-2 gap-4 px-4">
            <MonitorCurrentHumid />
            <MonitorCurrentTemp />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 py-4 md:w-1/4 w-full">
        <p className="font-bold text-lg border-b-2 px-4 pb-2">
          Latest Snapshots
        </p>
        <div className="flex flex-col gap-4 px-4">
          <div className="min-h-60 w-full object-fill border-2">
            <Camera />
          </div>
          <Button>
            <Link href={"/camera"} className="font-bold text-sm">
              See all Snapshots
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
