import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-bold text-indigo-600">
                  Admin Panel
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <form
                action={async () => {
                  "use server";
                  const cookieStore = await cookies();
                  cookieStore.delete("admin_session");
                  redirect("/admin");
                }}
              >
                <button
                  type="submit"
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500 py-32">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                Welcome to the Admin Dashboard
              </h2>
              <p>This is dummy text for the protected admin route.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
