"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PocketBase from "pocketbase";
import { Eye, Search, Filter } from "lucide-react";

const statusConfig: Record<string, { label: string; classes: string }> = {
  new: { label: "Nuovo", classes: "bg-blue-100 text-blue-800 border-blue-200" },
  in_review: { label: "In analisi", classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  prompt_generated: { label: "Prompt OK", classes: "bg-purple-100 text-purple-800 border-purple-200" },
  preview_in_progress: { label: "Sviluppo", classes: "bg-orange-100 text-orange-800 border-orange-200" },
  preview_ready: { label: "Pronta", classes: "bg-green-100 text-green-800 border-green-200" },
  contacted: { label: "Contattato", classes: "bg-teal-100 text-teal-800 border-teal-200" },
  converted: { label: "Convertito", classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  rejected: { label: "Rifiutato", classes: "bg-red-100 text-red-800 border-red-200" },
};

export type LeadRecord = {
  id: string;
  collectionId?: string;
  created: string;
  status: string;
  businessName?: string;
  fullName?: string;
  email?: string;
  sector?: string;
  [key: string]: unknown;
};

type LeadSubscriptionEvent = {
  action: string;
  record: LeadRecord;
};

function sortByCreatedDesc(records: LeadRecord[]) {
  return [...records].sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  );
}

export default function LeadTableClient({
  records,
  pocketbaseUrl,
  collectionName,
}: {
  records: LeadRecord[];
  pocketbaseUrl: string;
  collectionName: string;
}) {
  const [liveRecords, setLiveRecords] = useState(() => sortByCreatedDesc(records));
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [realtimeError, setRealtimeError] = useState(() =>
    pocketbaseUrl ? "" : "Realtime non configurato: manca l'URL di PocketBase."
  );

  useEffect(() => {
    if (!pocketbaseUrl) {
      return;
    }

    let isMounted = true;
    let unsubscribe: (() => Promise<void>) | undefined;
    const client = new PocketBase(pocketbaseUrl);
    client.autoCancellation(false);

    client
      .collection(collectionName)
      .subscribe<LeadRecord>("*", (event: LeadSubscriptionEvent) => {
        if (!isMounted) return;

        setRealtimeError("");
        setLiveRecords((current) => {
          const incoming = event.record;
          if (!incoming?.id) return current;

          if (event.action === "delete") {
            return current.filter((record) => record.id !== incoming.id);
          }

          return sortByCreatedDesc([
            incoming,
            ...current.filter((record) => record.id !== incoming.id),
          ]);
        });
      })
      .then((unsubscribeFn) => {
        if (!isMounted) {
          void unsubscribeFn();
          return;
        }
        unsubscribe = unsubscribeFn;
      })
      .catch((error) => {
        console.error("PocketBase realtime error:", error);
        if (isMounted) {
          setRealtimeError("Realtime non disponibile. Aggiorna la pagina per vedere gli ultimi dati.");
        }
      });

    return () => {
      isMounted = false;
      if (unsubscribe) {
        void unsubscribe();
      } else {
        void client.collection(collectionName).unsubscribe("*").catch(() => undefined);
      }
    };
  }, [collectionName, pocketbaseUrl]);

  const filtered = useMemo(() => {
    return liveRecords.filter((record) => {
      // Status filter
      if (statusFilter !== "all" && record.status !== statusFilter) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = [
          record.businessName,
          record.fullName,
          record.email,
          record.sector,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });
  }, [liveRecords, searchQuery, statusFilter]);

  return (
    <div>
      {/* Filters Bar */}
      <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome, attività, email, settore..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-border bg-background text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none"
          >
            <option value="all">Tutti gli stati</option>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {realtimeError && (
        <div className="px-4 py-2 text-xs text-amber-700 bg-amber-50 border-b border-amber-200">
          {realtimeError}
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border bg-muted/10">
        {filtered.length} risultat{filtered.length === 1 ? "o" : "i"} su {liveRecords.length}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          {liveRecords.length === 0
            ? "Nessuna richiesta ricevuta finora."
            : "Nessun risultato trovato per i filtri selezionati."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium">Attività</th>
                <th className="px-6 py-4 font-medium">Referente</th>
                <th className="px-6 py-4 font-medium">Settore</th>
                <th className="px-6 py-4 font-medium">Stato</th>
                <th className="px-6 py-4 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((record) => {
                const config = statusConfig[record.status] || { label: record.status, classes: "bg-gray-100 text-gray-800 border-gray-200" };
                return (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(record.created).toLocaleDateString("it-IT")}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {record.businessName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{record.fullName}</span>
                        <span className="text-xs text-muted-foreground">{record.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/${record.id}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Vedi
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
