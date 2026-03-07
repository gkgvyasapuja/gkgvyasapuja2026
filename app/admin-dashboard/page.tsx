export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-lg bg-white shadow border border-gray-100">
        <div className="px-4 sm:p-6 text-center text-gray-500 py-32">
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Welcome to the Admin Dashboard
          </h2>
          <p>Select a category from the sidebar to manage data.</p>
        </div>
      </div>
    </div>
  );
}
