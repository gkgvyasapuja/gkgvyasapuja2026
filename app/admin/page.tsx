"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = {
  error: "",
};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 font-sans overflow-hidden">
      {/* Background abstract decoration elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff6b4a]/10 rounded-full blur-3xl -translate-x-1/4 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0a2540]/10 rounded-full blur-3xl translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-black/5">
        <div className="mb-8 text-center space-y-4">
          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 text-[#ff6b4a]">
            <span className="h-[2px] w-12 bg-linear-to-r from-transparent to-[#ff6b4a]/40 block"></span>
            <span className="text-xl opacity-80">❀</span>
            <span className="h-[2px] w-12 bg-linear-to-l from-transparent to-[#ff6b4a]/40 block"></span>
          </div>

          <h1 className="text-3xl font-bold tracking-wide text-[#0a2540]">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="text-left space-y-2">
            <Label htmlFor="id" className="text-[#0a2540] font-medium">
              Admin ID
            </Label>
            <Input
              id="id"
              name="id"
              type="text"
              required
              placeholder="Enter ID"
              className="w-full rounded-xl border-gray-200 focus-visible:ring-[#ff6b4a] py-6 px-4"
            />
          </div>

          <div className="text-left space-y-2">
            <Label htmlFor="password" className="text-[#0a2540] font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter password"
              className="w-full rounded-xl border-gray-200 focus-visible:ring-[#ff6b4a] py-6 px-4"
            />
          </div>

          {state?.error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
              <div className="flex justify-center text-center">
                <h3 className="text-sm font-medium text-red-800">
                  {state.error}
                </h3>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-[#0a2540] hover:bg-[#0a2540]/90 text-white rounded-full py-6 text-base font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {pending ? "Authenticating..." : "Access Dashboard"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
