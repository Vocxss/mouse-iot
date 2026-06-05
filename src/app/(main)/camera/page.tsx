"use client";

import { Camera, cameraUrl } from "@/components/camera";
import { Button } from "@/components/retroui/Button";
import { Select } from "@/components/retroui/Select";
import { Switch } from "@/components/retroui/Switch";
import { useState } from "react";
import { toast } from "sonner";

const RESOLUTIONS: Record<string, string> = {
  "13": "UXGA (1600×1200)",
  "12": "SXGA (1280×1024)",
  "10": "XGA (1024×768)",
  "9": "SVGA (800×600)",
  "8": "VGA (640×480)",
  "5": "CIF (400×296)",
  "4": "QVGA (320×240)",
};

export default function CameraPage() {
  const [ledStatus, setLedStatus] = useState(false);
  const [resolution, setResolution] = useState("8");
  const [isRestarting, setIsRestarting] = useState(false);

  const sendCommand = async (param: string, value: string) => {
    try {
      await fetch(`${cameraUrl}/control?var=${param}&val=${value}`, {
        mode: "no-cors",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect to camera");
    }
  };

  const toggleLed = (checked: boolean) => {
    setLedStatus(checked);
    sendCommand("led_intensity", checked ? "255" : "0");
    toast.success(`LED turned ${checked ? "on" : "off"}`);
  };

  const changeResolution = (value: string | null) => {
    if (!value) return;
    setResolution(value);
    sendCommand("framesize", value);
    toast.success(`Resolution changed to ${RESOLUTIONS[value]}`);
  };

  const restartCamera = async () => {
    setIsRestarting(true);
    toast.info("Restarting camera...");
    try {
      await fetch(`${cameraUrl}/control?var=framesize&val=${resolution}`, {
        mode: "cors",
      });
      toast.success("Camera restarted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to restart camera");
    } finally {
      setIsRestarting(false);
    }
  };

  const takeSnapshot = () => {
    window.open(`${cameraUrl}/capture`, "_blank");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-full">
      <div className="flex flex-col gap-4 md:w-3/4 py-4 md:border-r-2 w-full">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-lg pb-2 border-b-2 px-4">
            Camera Monitoring
          </h2>
        </div>
        <div className="flex flex-col gap-4 ">
          <h2 className="text-lg font-bold px-4">Live Video</h2>
          <div className="flex flex-col gap-4 px-4">
            <div className="h-auto w-full aspect-video border-2 rounded-lg bg-secondary-background p-4 flex items-center justify-center overflow-hidden">
              <Camera />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-bold px-4 py-2 md:text-base text-xs border-2 shadow bg-green-400">
                Resolution: {RESOLUTIONS[resolution] ?? "Unknown"}
              </p>
              <Button
                className="font-bold md:text-base text-xs"
                onClick={takeSnapshot}
              >
                Take Snapshot
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full md:w-1/4 py-4">
        <h2 className="font-bold text-lg pb-2 border-b-2 px-4">
          Hardware Settings
        </h2>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-4 py-2">
            <label htmlFor="led" className="font-bold text-sm">
              Toggle LED
            </label>
            <Switch id="led" checked={ledStatus} onCheckedChange={toggleLed} />
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-2">
            <p className="font-bold text-sm">Resolution</p>
            <Select value={resolution} onValueChange={changeResolution}>
              <Select.Trigger className="w-fit font-bold text-sm">
                {RESOLUTIONS[resolution] ?? "Pick"}
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  {Object.entries(RESOLUTIONS).map(([val, label]) => (
                    <Select.Item key={val} value={val}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select>
          </div>
          <div className="px-4">
            <Button
              className="w-full font-bold"
              onClick={restartCamera}
              disabled={isRestarting}
            >
              {isRestarting ? "Restarting..." : "Restart Camera"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
