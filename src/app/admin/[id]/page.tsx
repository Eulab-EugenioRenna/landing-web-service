import { notFound } from "next/navigation";
import { pb, getCollectionName } from "@/lib/pocketbase";
import ClientDetails from "./ClientDetails";

export const revalidate = 0; // Disable cache

export default async function AdminDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const record = await pb.collection(getCollectionName()).getOne(id);
    
    const pocketbaseUrl = process.env.POCKETBASE_URL || "https://pocketbase.eulab.cloud";

    return (
      <div className="py-4">
        <ClientDetails record={record} pocketbaseUrl={pocketbaseUrl} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching record:", error);
    notFound();
  }
}
