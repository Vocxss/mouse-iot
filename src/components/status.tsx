"use client";

import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "../lib/firebaseConfig";
import { Card } from "./retroui/Card";

export const checkFirebaseStatus = () => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const connectedRef = ref(db, ".info/connected");
    const unSub = onValue(connectedRef, (snapshot) => {
      setStatus(snapshot.val() === true);
    });
    return () => unSub();
  }, []);

  return status;
};

export const checkESPCamStatus = () => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const test = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        await fetch(`http://${process.env.NEXT_PUBLIC_IP_CAM}/stream`, {
          signal: controller.signal,
          mode: "no-cors",
        });
        clearTimeout(timeoutId);
        setStatus(true);
      } catch (_error) {
        setStatus(false);
      }
    };
    test();
  }, []);
  return status;
};

export const checkESP32Status = () => {
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const dbRef = ref(db, "/humid");
    const unSub = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        setStatus(true);
      } else {
        setStatus(false);
      }
    });
    return () => unSub();
  }, []);
  return status;
};

export const Status = ({ type, status }: { type: string; status: boolean }) => {
  const bgColor =
    type === "firebase"
      ? "bg-amber-400"
      : type === "esp32-cam"
        ? "bg-red-400"
        : "bg-cyan-400";

  const displayName =
    type === "firebase"
      ? "Firebase"
      : type === "esp32-cam"
        ? "ESP32-Cam"
        : "ESP32-Wroom";

  return (
    <Card
      className={`flex flex-col gap-2 font-bold p-4 ${bgColor} transition-colors duration-300`}
    >
      <h1 className="text-sm">
        {displayName}:{" "}
        <span className="font-bold text-white text-base">
          {status ? "Connected" : "Disconnected"}
        </span>
      </h1>
    </Card>
  );
};

export const DeviceStatusSection = () => {
  const esp32Connected = checkESP32Status();
  const espCamConnected = checkESPCamStatus();
  const firebaseConnected = checkFirebaseStatus();

  return (
    <>
      <Status type="esp32" status={esp32Connected} />
      <Status type="esp32-cam" status={espCamConnected} />
      <Status type="firebase" status={firebaseConnected} />
    </>
  );
};
