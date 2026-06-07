"use client";

import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="animate-fade-in w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
