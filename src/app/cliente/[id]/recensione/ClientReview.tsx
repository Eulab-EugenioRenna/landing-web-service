"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Lock, Send, Star, Unlock } from "lucide-react";
import {
  requestReviewUnlock,
  submitClientReview,
  type WrittenReviewData,
} from "@/app/actions";

type ClientReviewProps = {
  recordId: string;
  token: string;
  fullName?: string;
  businessName?: string;
  initialReview: WrittenReviewData;
  isValidLink: boolean;
};

export default function ClientReview({
  recordId,
  token,
  fullName,
  businessName,
  initialReview,
  isValidLink,
}: ClientReviewProps) {
  const [writtenReview, setWrittenReview] = useState<WrittenReviewData>(initialReview || {});
  const [authorName, setAuthorName] = useState(writtenReview.authorName || fullName || "");
  const [reviewText, setReviewText] = useState(writtenReview.text || "");
  const [unlockReason, setUnlockReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingUnlock, setIsRequestingUnlock] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const reviewSubmitted = Boolean(writtenReview.text && writtenReview.submittedAt);
  const canWrite = !reviewSubmitted || Boolean(writtenReview.editUnlocked);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const result = await submitClientReview(recordId, token, authorName, reviewText);
      if (!result.success) throw new Error(result.error);
      if (result.writtenReview) setWrittenReview(result.writtenReview);
      setSuccess("Recensione salvata. Grazie!");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante il salvataggio della recensione");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestUnlock = async () => {
    setIsRequestingUnlock(true);
    setError("");
    setSuccess("");
    try {
      const result = await requestReviewUnlock(recordId, token, unlockReason);
      if (!result.success) throw new Error(result.error);
      if (result.writtenReview) setWrittenReview(result.writtenReview);
      setUnlockReason("");
      setSuccess("Richiesta di sblocco inviata all’admin Eulab.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore durante la richiesta di sblocco");
    } finally {
      setIsRequestingUnlock(false);
    }
  };

  if (!isValidLink) {
    return (
      <main className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="max-w-lg bg-card border border-border rounded-3xl p-8 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Link recensione non valido</h1>
          <p className="text-muted-foreground mt-3">
            Il link è assente, errato o non ancora attivato. Chiedi a Eulab di inviarti un nuovo invito.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recensione scritta</p>
              <h1 className="text-2xl font-bold">{businessName || "Il tuo progetto"}</h1>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 text-sm leading-relaxed">
            Puoi inviare la recensione una sola volta. Dopo l’invio non sarà modificabile, salvo richiesta di autorizzazione e sblocco da parte dell’admin Eulab.
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
          {reviewSubmitted && !writtenReview.editUnlocked && (
            <div className="p-4 rounded-2xl border border-green-200 bg-green-50 text-green-800 text-sm flex gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Recensione già inviata</p>
                <p>Il testo è bloccato. Se vuoi modificarlo, richiedi lo sblocco qui sotto.</p>
              </div>
            </div>
          )}

          {writtenReview.editUnlocked && (
            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50 text-blue-800 text-sm flex gap-3">
              <Unlock className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Modifica autorizzata</p>
                <p>Puoi aggiornare la recensione. Dopo il salvataggio verrà bloccata di nuovo.</p>
              </div>
            </div>
          )}

          <label className="block text-sm font-semibold">
            Nome da mostrare
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              disabled={!canWrite}
              className="mt-2 w-full p-3 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              placeholder="Il tuo nome"
            />
          </label>

          <label className="block text-sm font-semibold">
            Recensione
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={!canWrite}
              className="mt-2 w-full min-h-48 p-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60"
              placeholder="Scrivi qui la tua recensione..."
            />
          </label>

          {(error || success) && (
            <div className={`p-3 rounded-xl text-sm border ${error ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
              {error || success}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !canWrite || reviewText.trim().length < 10}
            className="w-full px-6 py-3 bg-amber-600 text-white rounded-2xl hover:bg-amber-700 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {reviewSubmitted ? "Salva modifica" : "Invia recensione"}
          </button>
        </div>

        {reviewSubmitted && !writtenReview.editUnlocked && (
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Lock className="w-5 h-5" /> Richiedi modifica
            </h2>
            <p className="text-sm text-muted-foreground">
              Spiega cosa vuoi correggere: l’admin riceverà la richiesta e potrà sbloccare la recensione.
            </p>
            <textarea
              value={unlockReason}
              onChange={(e) => setUnlockReason(e.target.value)}
              className="w-full min-h-24 p-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Vorrei modificare la recensione perché..."
            />
            <button
              onClick={handleRequestUnlock}
              disabled={isRequestingUnlock}
              className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-2xl flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
            >
              {isRequestingUnlock ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
              Richiedi sblocco
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
