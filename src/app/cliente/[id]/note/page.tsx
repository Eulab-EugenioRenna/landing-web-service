import { notFound } from "next/navigation";
import { pb, getCollectionName } from "@/lib/pocketbase";
import type { ClientChatData } from "@/app/actions";
import ClientNotes from "./ClientNotes";

export const revalidate = 0;

type ClientNotesRecord = {
  id: string;
  fullName?: string;
  businessName?: string;
  clientChat?: ClientChatData;
};

export default async function ClientNotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token = "" } = await searchParams;
  let record: ClientNotesRecord;

  try {
    record = await pb.collection(getCollectionName()).getOne<ClientNotesRecord>(id);
  } catch (error) {
    console.error("Error fetching client notes record:", error);
    notFound();
  }

  const clientChat = record.clientChat || { messages: [] };
  const isValidLink = Boolean(clientChat.token && clientChat.token === token);

  return (
    <ClientNotes
      recordId={record.id}
      token={token}
      fullName={record.fullName}
      businessName={record.businessName}
      initialChat={clientChat}
      isValidLink={isValidLink}
    />
  );
}
