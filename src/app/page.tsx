import { API_ROUTES } from "@/constants/api-routes";

export default async function HomePage() {
  const ipAddress = await fetch(API_ROUTES.IP_ADDRESS);
  const data = await ipAddress.json();
  console.log(data);

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">IP Address</h1>
        <p className="text-lg">Your IP: {data.ip}</p>
        <p className="text-sm text-gray-500">Timestamp: {data.timestamp}</p>
      </div>
    </main>
  );
}
