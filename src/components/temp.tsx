"use client";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { Card } from "./retroui/Card";
import { Thermometer, WavesVerticalIcon } from "lucide-react";

export const MonitorCurrentTemp = () => {
  const [tempValue, setTempValue] = useState(null);
  const [status, setStatus] = useState("Warm");

  useEffect(() => {
    const tempRef = ref(db, "/temp");

    if (Number(tempValue) >= 29) {
      setStatus("Critical");
    } else if (Number(tempValue) >= 25 && Number(tempValue) <= 29) {
      setStatus("Warm");
    } else {
      setStatus("Cold");
    }

    const unsubscribe = onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      setTempValue(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Card className="flex flex-col gap-4 p-4 md:items-start items-center bg-cyan-400">
      <h2 className="flex items-center justify-between md:flex-row flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <span>
            <Thermometer className="size-5" />
          </span>
          <p className="text-sm font-bold">Current Temperature:</p>
        </div>
        <p className="text-xs font-bold text-right text-cyan-800">
          Status: {status}
        </p>
      </h2>
      <p className="font-bold text-white">
        {!tempValue ? "-" : tempValue + "\u00B0C"}
      </p>
    </Card>
  );
};

export const MonitorCurrentHumid = () => {
  const [humidValue, setHumidValue] = useState<string | null>(null);
  const [status, setStatus] = useState("Normal");

  useEffect(() => {
    const humidRef = ref(db, "/humid");

    const unsubscribe = onValue(humidRef, (snapshot) => {
      const data = snapshot.val();
      setHumidValue(data);
    });

    if (Number(humidValue) >= 60) {
      setStatus("Humid");
    } else if (Number(humidValue) <= 40) {
      setStatus("Dry");
    } else {
      setStatus("Normal");
    }

    return () => unsubscribe();
  }, []);

  return (
    <Card className="flex flex-col gap-4 p-4 md:items-start items-center bg-green-400">
      <h2 className="flex items-center justify-between md:flex-row flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <span>
            <WavesVerticalIcon className="size-5" />
          </span>
          <p className="text-sm font-bold">Current Humidity:</p>
        </div>
        <p className="text-xs font-bold text-right text-green-900">
          Status: {status}
        </p>
      </h2>
      <p className="font-bold text-white">
        {!humidValue ? "-" : humidValue + "%"}
      </p>
    </Card>
  );
};
