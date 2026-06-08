export const cameraUrl = process.env.NEXT_PUBLIC_IP_CAM;

export const Camera = () => {
  return (
    <div className="w-full h-auto flex items-center justify-center">
      <img
        src={`${cameraUrl}:81/stream`}
        alt="No Camera Detected"
        className="w-full h-full object-fill"
      />
    </div>
  );
};  
