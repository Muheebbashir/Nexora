"use client";

import { auth_service, useAppData } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/components/loading";
import type { User } from "@/type";
import axios from "axios";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  Lock,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

type UserRole = "jobseeker" | "recruiter";

interface RegisterResponse {
  message: string;
  token: string;
  registeredUser: User;
}

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const { isAuth, loading, setUser, setIsAuth } = useAppData();

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setResume(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload your resume as a PDF file");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Resume size should be less than 5MB");
      event.target.value = "";
      return;
    }

    setResume(selectedFile);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (role === "jobseeker" && !resume) {
      toast.error("A PDF resume is required for jobseekers");
      return;
    }

    setBtnLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("role", role);

      if (bio.trim()) {
        formData.append("bio", bio.trim());
      }

      if (resume) {
        formData.append("file", resume);
      }

      const { data } = await axios.post<RegisterResponse>(
        `${auth_service}/api/auth/register`,
        formData,
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      setUser(data.registeredUser);
      setIsAuth(true);
      toast.success(data.message);
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? "Unable to create your account"
        : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (isAuth) return redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create your Nexora account</h1>
          <p className="text-sm opacity-70">
            Join Nexora and take the next step in your career
          </p>
        </div>

        <div className="border border-gray-400 rounded-2xl p-6 sm:p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <UserRound className="icon-style" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative">
                  <Phone className="icon-style" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Your phone number"
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    autoComplete="tel"
                    required
                    className="h-11 pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="icon-style" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="icon-style" />
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">I am joining as</Label>
              <div className="relative">
                <BriefcaseBusiness className="icon-style" />
                <select
                  id="role"
                  value={role}
                  onChange={(event) => setRole(event.target.value as UserRole)}
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="jobseeker">Jobseeker</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
            </div>

            {role === "jobseeker" && (
              <div className="space-y-2">
                <Label htmlFor="resume">Resume (PDF, max 5MB)</Label>
                <div className="relative">
                  <FileText className="icon-style" />
                  <Input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                    required
                    className="h-11 cursor-pointer pl-10 pt-2"
                  />
                </div>
                {resume && (
                  <p className="text-xs text-green-600">{resume.name}</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio (optional)</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell us about yourself and your career goals"
                rows={4}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <Button
              type="submit"
              disabled={btnLoading}
              aria-busy={btnLoading}
              className="h-11 w-full gap-2"
            >
              {btnLoading ? "Creating account..." : "Create Account"}
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 border-t border-gray-300 pt-6">
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-500 transition-all hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
