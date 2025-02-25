"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoginFormData, loginSchema } from "@/schemas/loginSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AlmaLogo from "@/components/icon/icon";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("Login data:", data);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login error:", errorData);
        return;
      }

      // Handle successful login (e.g., navigate to dashboard)
      console.log("Logged in successfully!");
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white relative w-full w-">
      <div className="absolute -top-40 -left-40 w-2/5 h-3/5 rounded-full bg-gradient-to-br from-[#c1ca6f] to-[#fff] blur-3xl opacity-80 pointer-events-none" />
      <div className="mx-auto w-full flex justify-center">
        <AlmaLogo className="bg-white w-20 h-20" />
      </div>
      <div className="max-w-sm mx-auto w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                      />
                      <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeClosed /> : <Eye />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11">
              Login
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
