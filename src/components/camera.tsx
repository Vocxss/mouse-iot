"use client";

import { useState } from "react";
import { toast } from "sonner";

export const cameraUrl = "http://192.168.252.164";

export const Camera = () => {
  return (
    <div className="w-full h-auto flex items-center justify-center">
      <img
        src={`${cameraUrl}:81/stream`}
        alt="Camera Stream"
        className="w-full h-full object-fill"
      />
    </div>
  );
};
