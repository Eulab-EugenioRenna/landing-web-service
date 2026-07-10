"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2, AlertTriangle } from "lucide-react";
import { addClientChatMessage, type ClientChatData } from "@/app/actions";

type ClientNotesProps = {
  recordId: string;
  token: string;
  fullName?: string;
  businessName?: string;
  initialChat: ClientChatData;
  isValidLink: boolean;
};

export default function ClientNotes({
  recordId,
  token,
  fullName,
  businessName,
  initialChat,
  isValidLink,
}: ClientNotesProps) {
  const [clientChat, setClientChat] = useState<ClientChatData>(initialChat || { messages: [] });
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const messages = clientChat.messages || [];

  const handleSubmit = async () => {
    setIsSending(true);
    setError("");
    setSuccess("");
    try {
      const result = await addClientChatMessage(recordId, token, message);
      if (!result.success) throw new Error(result.error);
      if (result.clientChat) setClientChat(result.clientChat);
      setMessage("");
      setSuccess("Nota inviata correttamente.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante l'invio della nota");
    } finally {
      setIsSending(false);
    }
  };

  if (!isValidLink) {
    return (
      <main className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="max-w-lg bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Link note non valido</h1>
          <p className="text-muted-foreground mt-3">
            Il link è assente, errato o non ancora attivato. Chiedi a Eulab di inviarti un nuovo invito.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spazio note progetto</p>
              <h1 className="text-2xl font-bold">{businessName || "Il tuo progetto"}</h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-4">
            Ciao {fullName || ""}, qui puoi lasciarci note, richieste o chiarimenti in stile chat. I messaggi saranno visibili al team Eulab.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-4 shadow-sm">
          <div className="h-[55vh] min-h-80 overflow-y-auto bg-muted/30 rounded-2xl p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-16">
                Nessuna nota ancora. Scrivi il primo messaggio qui sotto.
              </p>
            ) : (
              messages.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  className={`flex ${chatMessage.author === "client" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${chatMessage.author === "client" ? "bg-brand-600 text-white" : "bg-white dark:bg-zinc-900 border border-border"}`}>
                    <p className="text-[11px] opacity-70 mb-1">
                      {chatMessage.author === "client" ? "Tu" : "Eulab"} · {new Date(chatMessage.createdAt).toLocaleString("it-IT")}
                    </p>
                    <p className="whitespace-pre-wrap">{chatMessage.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {(error || success) && (
            <div className={`mt-4 p-3 rounded-xl text-sm border ${error ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
              {error || success}
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scrivi una nota per Eulab..."
              className="min-h-24 flex-1 p-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleSubmit}
              disabled={isSending || !message.trim()}
              className="px-6 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Invia nota
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
