import { Camera, cameraUrl } from "@/components/camera";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Thermometer, WavesVertical } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="flex flex-col md:flex-row min-h-full">
      <div className="flex flex-col gap-8 md:w-3/4 py-4 md:border-r-2 w-full">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg pb-2 border-b-2 px-4">
            Device Status
          </h2>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4 px-4">
            <Card className="flex flex-col gap-2 font-bold p-4 bg-cyan-400">
              <h1 className="text-sm">
                ESP32-Wroom:{" "}
                <span className="font-bold text-white text-base">
                  Connected
                </span>
              </h1>
            </Card>
            <Card className="flex flex-col gap-2 font-bold p-4 bg-red-400">
              <h1 className="text-sm">
                ESP32-Cam:{" "}
                <span className="font-bold text-white text-base">
                  Connected
                </span>
              </h1>
            </Card>
            <Card className="flex flex-col gap-2 font-bold p-4 bg-amber-400">
              <h1 className="text-sm">
                Firebase:{" "}
                <span className="font-bold text-white text-base">
                  Connected
                </span>
              </h1>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <h2 className="text-lg font-bold border-t-2 pt-2 px-4">
            Environtment Data
          </h2>
          <div className="grid grid-cols-2 gap-4 px-4">
            <Card className="flex flex-col gap-4 p-4 md:items-start items-center bg-green-400">
              <h2 className="flex items-center justify-between md:flex-row flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span>
                    <WavesVertical className="size-5" />
                  </span>
                  <p className="text-sm font-bold">Humidity:</p>
                </div>
                <p className="text-xs font-bold text-right text-green-900">
                  Status: Normal
                </p>
              </h2>
              <p className="font-bold text-white">62%</p>
            </Card>
            <Card className="flex flex-col gap-4 p-4 md:items-start items-center bg-blue-500">
              <h2 className="flex items-center justify-between md:flex-row flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span>
                    <Thermometer className="size-5" />
                  </span>
                  <p className="text-sm font-bold">Temperature:</p>
                </div>
                <p className="text-xs font-bold text-right text-blue-900">
                  Status: Normal
                </p>
              </h2>
              <p className="font-bold text-white">62 &deg;C</p>
            </Card>
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
