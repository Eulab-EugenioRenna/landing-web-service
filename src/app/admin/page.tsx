import { pb, getCollectionName } from "@/lib/pocketbase";
import LeadTableClient from "./LeadTableClient";

export const revalidate = 0; // Disable cache for this page

export default async function AdminPage() {
  let records: any[] = [];
  let error = false;

  try {
    records = await pb.collection(getCollectionName()).getFullList({
      sort: '-created',
    });
  } catch (e) {
    console.error("Error fetching leads:", e);
    error = true;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Richieste Landing</h1>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {error ? (
          <div className="p-8 text-center text-red-500">
            Errore nel caricamento delle richieste. Assicurati che PocketBase sia configurato e online.
          </div>
        ) : records.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Nessuna richiesta ricevuta finora.
          </div>
        ) : (
          <LeadTableClient records={records} />
        )}
      </div>
    </div>
  );
}
