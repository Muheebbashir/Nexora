"use client";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/type";
import Loading from "@/components/loading";

interface LoginResponse {
  message: string;
  token: string;
  userObject: User;
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, loading, setUser, setIsAuth } = useAppData();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);
    try {
      const { data } = await axios.post<LoginResponse>(
        `${auth_service}/api/auth/login`,
        { email, password },
      );
      toast.success(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      setUser(data.userObject);
      setIsAuth(true);
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? "Unable to log in")
        : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loading/>;
  if (isAuth) return redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back to Nexora</h1>
          <p className="text-sm opacity-70">Sign In to continue your journey</p>
        </div>
        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="icon-style" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="icon-style" />
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href={'/forgot'} className="text-sm text-blue-500 hover:underline transition-all ">
                Forgot Password
              </Link>
            </div>
            <Button
              type="submit"
              disabled={btnLoading}
              aria-busy={btnLoading}
              className="w-full"
            >
              {btnLoading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-center text-sm">
              Don't have an account? <Link href={'/register'} className="text-blue-500 font-medium hover:underline transition-all">
              Create new Account?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
