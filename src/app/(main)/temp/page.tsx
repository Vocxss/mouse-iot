import { MonitorCurrentHumid, MonitorCurrentTemp } from "@/components/temp";
import { TempHumidChart } from "@/components/temp-chart";

export default function TempPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col gap-4 py-4">
        <h2 className="font-bold text-lg pb-2 border-b-2 px-4">
          Temp &amp; Humidity Analytics
        </h2>
      </div>
      <div className="flex flex-col gap-8 py-2 px-4">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg">Realtime Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <MonitorCurrentHumid />
            <MonitorCurrentTemp />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold">Line Chart</h2>
          <TempHumidChart />
        </div>
      </div>
    </div>
  );
}
