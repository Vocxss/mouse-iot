'use client'
import { z } from "zod"
import { Card } from "@/components/retroui/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/retroui/Input";
import { Button } from "@/components/retroui/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import React from "react";
import { Eye, EyeClosed } from "lucide-react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";

const loginSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long")
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = async (data: LoginFormData) => {
        console.log(data)
        const auth = getAuth(app)
        
        const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
        
            const re = await userCredential.user.getIdTokenResult()
            
            try {
                const k = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${re.token}`
                    }}).then(res => res.json())
                
            if (k.uid) {
              toast("Logged in successfully!");
              router.push("/dashboard");
            } else {
              toast.error("Login failed. Please try again.");
            }
        } catch (error) {
            toast.error("Invalid email or password", {
                richColors: true,
            })
        }
    }

    return (
      <Card className="max-w-sm w-full shadow-none">
        <Card.Header className="flex flex-col justify-center items-center">
          <Card.Title>Login</Card.Title>
          <Card.Description>Sign in to your account</Card.Description>
        </Card.Header>
        <Card.Content>
          <form
            className="flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <Input
                {...register("email")}
                type="email"
                placeholder="johndoe@gmail.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <span
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? <EyeClosed /> : <Eye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit">Login</Button>
          </form>
        </Card.Content>
      </Card>
    );
}