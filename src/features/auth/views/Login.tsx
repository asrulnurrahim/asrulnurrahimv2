"use client";

import { Suspense } from "react";
import { LoginForm } from "../components/LoginForm";

export function Login() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
