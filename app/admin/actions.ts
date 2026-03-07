"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(prevState: any, formData: FormData) {
  const id = formData.get("id");
  const password = formData.get("password");

  const adminId = process.env.ADMIN_ID;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (id === adminId && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/admin-dashboard");
  }

  return { error: "Invalid credentials" };
}
