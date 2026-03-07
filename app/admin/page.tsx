"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";
import { Button } from "@/components/ui/button"; // Assuming shadcn UI is available based on previous chats, otherwise I'll fallback to native HTML but let's try standard html forms for simplicity and minimum deps.

const initialState = {
  error: "",
};

export default function AdminLogin() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Admin ID
            </label>
            <div className="mt-2">
              <input
                id="id"
                name="id"
                type="text"
                required
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Enter ID"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Enter password"
              />
            </div>
          </div>

          {state?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {state.error}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {pending ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
