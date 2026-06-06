import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <Image className="absolute w-full h-full object-cover opacity-80" width={1280} height={720} alt="Background" loading="eager" src={"/bg.jpg"} />
            <div className="relative z-10 w-full max-w-md p-8 bg-white">
            {children}
            </div>
        </div>
    )
}