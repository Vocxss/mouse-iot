import { MonitorCurrentHumid, MonitorCurrentTemp } from "@/components/temp";

export default function TempPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col gap-4 py-4">
        <h2 className="font-bold text-lg pb-2 border-b-2 px-4">
          Temp & Humidity Analytics
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
        <div className="flex flex-col gap-4 ">
          <h2 className="text-lg font-bold">Stats Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 font-bold px-4 py-2 md:text-base text-xs border-2 shadow bg-red-400">
              <p>Highest Temp:</p>
              <p>32 &deg;C</p>
            </div>
            <div className="flex flex-col gap-2 font-bold px-4 py-2 md:text-base text-xs border-2 shadow bg-cyan-400">
              <p>Lowest Temp:</p>
              <p>25 &deg;C</p>
            </div>
            <div className="flex flex-col gap-2 font-bold px-4 py-2 md:text-base text-xs border-2 shadow bg-green-400">
              <p>Average Temp:</p>
              <p>25 &deg;C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
