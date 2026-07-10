"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, Sparkles, Loader2, RefreshCcw, Mail, ExternalLink, CheckCircle2, MessageCircle, Send, Star, Unlock, Lock } from "lucide-react";
import {
  updateLead,
  sendStatusEmail,
  sendPreviewEmail,
  sendClientChatInviteEmail,
  addAdminChatMessage,
  sendReviewInviteEmail,
  setReviewEditUnlock,
  type ClientChatData,
  type WrittenReviewData,
} from "@/app/actions";

type LeadDetailsRecord = {
  id: string;
  collectionId?: string;
  status?: string;
  internalNotes?: string;
  aiPrompt?: string;
  previewUrl?: string;
  logoFile?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  sector?: string;
  mainGoal?: string;
  existingWebsite?: string;
  socialLinks?: string;
  services?: string;
  contentNotes?: string;
  brandColors?: string;
  brandPersonality?: string;
  desiredFont?: string;
  clientChat?: ClientChatData;
  writtenReview?: WrittenReviewData;
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function ClientDetails({ record, pocketbaseUrl }: { record: LeadDetailsRecord, pocketbaseUrl: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(record.status || "new");
  const [internalNotes, setInternalNotes] = useState(record.internalNotes || "");
  const [aiPrompt, setAiPrompt] = useState(record.aiPrompt || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Email state
  const [isSendingStatus, setIsSendingStatus] = useState(false);
  const [statusEmailSent, setStatusEmailSent] = useState(false);
  const [isSendingPreview, setIsSendingPreview] = useState(false);
  const [previewEmailSent, setPreviewEmailSent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(record.previewUrl || "");
  const [emailError, setEmailError] = useState("");

  // Client portal state
  const [clientChat, setClientChat] = useState<ClientChatData>(record.clientChat || { messages: [] });
  const [writtenReview, setWrittenReview] = useState<WrittenReviewData>(record.writtenReview || {});
  const [adminChatMessage, setAdminChatMessage] = useState("");
  const [isSendingChatInvite, setIsSendingChatInvite] = useState(false);
  const [isAddingAdminMessage, setIsAddingAdminMessage] = useState(false);
  const [isSendingReviewInvite, setIsSendingReviewInvite] = useState(false);
  const [isTogglingReviewUnlock, setIsTogglingReviewUnlock] = useState(false);
  const [portalMessage, setPortalMessage] = useState("");
  const [portalError, setPortalError] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleUpdate = async (newStatus: string, newNotes: string, newPrompt: string) => {
    setIsSaving(true);
    try {
      const result = await updateLead(record.id, {
        status: newStatus,
        internalNotes: newNotes,
        aiPrompt: newPrompt
      });

      if (!result.success) throw new Error(result.error);

      setStatus(newStatus);
      setInternalNotes(newNotes);
      setAiPrompt(newPrompt);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Errore durante il salvataggio automatico");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDebouncedUpdate = (newStatus: string, newNotes: string, newPrompt: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleUpdate(newStatus, newNotes, newPrompt);
    }, 2000);
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record)
      });

      if (!res.ok) throw new Error("Errore API");

      const data = (await res.json()) as { prompt: string };
      setAiPrompt(data.prompt);

      // Auto-save generated prompt
      await handleUpdate(status, internalNotes, data.prompt);
    } catch (e) {
      console.error(e);
      alert("Errore durante la generazione. Assicurati che Ollama sia in esecuzione localmente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    alert("Copiato!");
  };

  // ─── Email handlers ──────────────────────────────────────────────────────

  const handleSendStatusEmail = async () => {
    setIsSendingStatus(true);
    setEmailError("");
    setStatusEmailSent(false);
    try {
      const result = await sendStatusEmail(record.email || "", record.fullName || "", record.businessName || "", status);
      if (!result.success) throw new Error(result.error);
      setStatusEmailSent(true);
      setTimeout(() => setStatusEmailSent(false), 5000);
    } catch (e: unknown) {
      setEmailError(getErrorMessage(e, "Errore invio email stato"));
    } finally {
      setIsSendingStatus(false);
    }
  };

  const handleSendPreviewEmail = async () => {
    if (!previewUrl.trim()) {
      setEmailError("Inserisci l’URL della preview prima di inviare.");
      return;
    }
    setIsSendingPreview(true);
    setEmailError("");
    setPreviewEmailSent(false);
    try {
      const result = await sendPreviewEmail(
        record.email || "",
        record.fullName || "",
        record.businessName || "",
        previewUrl.trim(),
        record.id
      );
      if (!result.success) throw new Error(result.error);
      setPreviewEmailSent(true);
      setTimeout(() => setPreviewEmailSent(false), 5000);
    } catch (e: unknown) {
      setEmailError(getErrorMessage(e, "Errore invio email preview"));
    } finally {
      setIsSendingPreview(false);
    }
  };

  const handleSendChatInvite = async () => {
    setIsSendingChatInvite(true);
    setPortalError("");
    setPortalMessage("");
    try {
      const result = await sendClientChatInviteEmail(record.id);
      if (!result.success) throw new Error(result.error);
      if (result.clientChat) setClientChat(result.clientChat);
      setPortalMessage("Email per le note inviata al cliente.");
      router.refresh();
    } catch (e: unknown) {
      setPortalError(getErrorMessage(e, "Errore invio email note"));
    } finally {
      setIsSendingChatInvite(false);
    }
  };

  const handleAddAdminChatMessage = async () => {
    setIsAddingAdminMessage(true);
    setPortalError("");
    setPortalMessage("");
    try {
      const result = await addAdminChatMessage(record.id, adminChatMessage);
      if (!result.success) throw new Error(result.error);
      if (result.clientChat) setClientChat(result.clientChat);
      setAdminChatMessage("");
      setPortalMessage("Messaggio admin salvato nella chat note.");
      router.refresh();
    } catch (e: unknown) {
      setPortalError(getErrorMessage(e, "Errore salvataggio messaggio"));
    } finally {
      setIsAddingAdminMessage(false);
    }
  };

  const handleSendReviewInvite = async () => {
    setIsSendingReviewInvite(true);
    setPortalError("");
    setPortalMessage("");
    try {
      const result = await sendReviewInviteEmail(record.id);
      if (!result.success) throw new Error(result.error);
      if (result.writtenReview) setWrittenReview(result.writtenReview);
      setPortalMessage("Email recensione inviata al cliente.");
      router.refresh();
    } catch (e: unknown) {
      setPortalError(getErrorMessage(e, "Errore invio email recensione"));
    } finally {
      setIsSendingReviewInvite(false);
    }
  };

  const handleToggleReviewUnlock = async (unlocked: boolean) => {
    setIsTogglingReviewUnlock(true);
    setPortalError("");
    setPortalMessage("");
    try {
      const result = await setReviewEditUnlock(record.id, unlocked);
      if (!result.success) throw new Error(result.error);
      if (result.writtenReview) setWrittenReview(result.writtenReview);
      setPortalMessage(unlocked ? "Recensione sbloccata per la modifica." : "Modifica recensione bloccata.");
      router.refresh();
    } catch (e: unknown) {
      setPortalError(getErrorMessage(e, "Errore aggiornamento sblocco recensione"));
    } finally {
      setIsTogglingReviewUnlock(false);
    }
  };

  const logoUrl = record.logoFile
    ? `${pocketbaseUrl}/api/files/${record.collectionId}/${record.id}/${record.logoFile}`
    : null;

  const statusLabels: Record<string, string> = {
    new: "Nuovo",
    in_review: "In analisi",
    prompt_generated: "Prompt Generato",
    preview_in_progress: "Preview in progress",
    preview_ready: "Preview Pronta",
    contacted: "Contattato",
    converted: "Convertito",
    rejected: "Rifiutato",
  };

  const chatMessages = clientChat.messages || [];
  const reviewSubmitted = Boolean(writtenReview.text && writtenReview.submittedAt);
  const reviewEditRequested = Boolean(writtenReview.editRequestedAt);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <h1 className="text-3xl font-bold">{record.businessName}</h1>
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => handleUpdate(e.target.value, internalNotes, aiPrompt)}
            className="px-4 py-2 border border-border rounded-xl bg-background cursor-pointer hover:bg-muted transition-colors focus:ring-2 focus:ring-brand-500"
          >
            <option value="new">Nuovo</option>
            <option value="in_review">In analisi</option>
            <option value="prompt_generated">Prompt Generato</option>
            <option value="preview_in_progress">Preview in progress</option>
            <option value="preview_ready">Preview Pronta</option>
            <option value="contacted">Contattato</option>
            <option value="converted">Convertito</option>
            <option value="rejected">Rifiutato</option>
          </select>
          {isSaving && <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-border space-y-6">
          <h2 className="text-xl font-bold border-b border-border pb-3">Dati Lead</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground font-medium">Nome</p>
              <p className="font-semibold">{record.fullName}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Contatti</p>
              <p>{record.email}</p>
              <p>{record.phone}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Settore</p>
              <p>{record.sector}</p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium">Obiettivo</p>
              <p className="capitalize">{record.mainGoal}</p>
            </div>
            {(record.existingWebsite || record.socialLinks) && (
              <div className="col-span-2">
                <p className="text-muted-foreground font-medium">Link Esistenti</p>
                {record.existingWebsite && <p className="text-brand-600 underline"><a href={record.existingWebsite} target="_blank">{record.existingWebsite}</a></p>}
                {record.socialLinks && <p>{record.socialLinks}</p>}
              </div>
            )}
            <div className="col-span-2 mt-4">
              <p className="text-muted-foreground font-medium">Servizi offerti</p>
              <p className="bg-muted p-3 rounded-lg mt-1">{record.services}</p>
            </div>
            <div className="col-span-2 mt-4">
              <p className="text-muted-foreground font-medium">Contenuti Essenziali</p>
              <p className="bg-muted p-3 rounded-lg mt-1">{record.contentNotes}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card p-6 rounded-2xl border border-border space-y-6">
            <h2 className="text-xl font-bold border-b border-border pb-3">Brand Identity</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground font-medium">Colori Brand</p>
                <p>{record.brandColors}</p>
              </div>
              <div>
                <p className="text-muted-foreground font-medium">Personalità</p>
                <p>{record.brandPersonality}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground font-medium">Stile / Font</p>
                <p>{record.desiredFont}</p>
              </div>
            </div>
            {logoUrl && (
              <div className="mt-4">
                <p className="text-muted-foreground font-medium mb-2">Logo Caricato</p>
                <a href={logoUrl} target="_blank" rel="noopener noreferrer" className="block w-fit">
                  <img src={logoUrl} alt="Logo" className="max-h-24 rounded-lg border border-border p-2 bg-muted/50 hover:bg-muted transition-colors" />
                </a>
                <a href={logoUrl} target="_blank" rel="noopener noreferrer" download className="text-sm text-brand-600 hover:underline mt-2 inline-flex items-center gap-1">
                  Scarica logo
                </a>
              </div>
            )}
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border space-y-4">
            <h2 className="text-xl font-bold border-b border-border pb-3">Note Interne</h2>
            <textarea
              value={internalNotes}
              onChange={(e) => {
                setInternalNotes(e.target.value);
                handleDebouncedUpdate(status, e.target.value, aiPrompt);
              }}
              className="w-full h-32 p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Aggiungi note per il team (salvataggio automatico)..."
            />
          </div>
        </div>
      </div>

      {/* ─── Comunicazioni Email ──────────────────────────────────────────── */}
      <div className="bg-card p-6 rounded-2xl border border-border space-y-6 shadow-sm border-t-4 border-t-blue-500">
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Mail className="w-5 h-5" /> Comunicazioni Email
        </h2>

        {emailError && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
            {emailError}
          </div>
        )}

        {/* Invio mail stato */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
          <div className="flex-1">
            <p className="font-semibold text-sm">Notifica aggiornamento stato</p>
            <p className="text-xs text-muted-foreground mt-1">
              Invia a <strong>{record.email}</strong> una mail con lo stato attuale: <strong>{statusLabels[status] || status}</strong>
            </p>
          </div>
          <button
            onClick={handleSendStatusEmail}
            disabled={isSendingStatus}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors disabled:opacity-50 shrink-0"
          >
            {isSendingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : statusEmailSent ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
            {statusEmailSent ? "Inviata!" : "Invia mail stato"}
          </button>
        </div>

        {/* Invio mail preview con URL */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border space-y-4">
          <div>
            <p className="font-semibold text-sm">Consegna preview con link</p>
            <p className="text-xs text-muted-foreground mt-1">
              Inserisci l’URL del dominio dove è pubblicata la preview e invia la mail al cliente.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://preview.miosito.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              onClick={handleSendPreviewEmail}
              disabled={isSendingPreview || !previewUrl.trim()}
              className="px-5 py-2.5 gradient-bg font-medium rounded-xl hover:shadow-lg flex items-center gap-2 text-sm transition-all disabled:opacity-50 shrink-0"
            >
              {isSendingPreview ? <Loader2 className="w-4 h-4 animate-spin" /> : previewEmailSent ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              {previewEmailSent ? "Inviata!" : "Invia mail preview"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Portale Cliente: note chat + recensione ─────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-2xl border border-border space-y-5 shadow-sm border-t-4 border-t-teal-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-teal-700 dark:text-teal-400">
                <MessageCircle className="w-5 h-5" /> Note cliente in chat
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Le note sono salvate nel campo JSON <code>clientChat</code> di PocketBase.
              </p>
            </div>
            <button
              onClick={handleSendChatInvite}
              disabled={isSendingChatInvite}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {isSendingChatInvite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Invia mail note
            </button>
          </div>

          <div className="h-72 overflow-y-auto bg-muted/30 rounded-2xl border border-border p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-10">
                Nessun messaggio ancora. Invia la mail al cliente o aggiungi una nota admin.
              </p>
            ) : (
              chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.author === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.author === "admin" ? "bg-brand-600 text-white" : "bg-white dark:bg-zinc-900 border border-border"}`}>
                    <p className="text-[11px] opacity-70 mb-1">
                      {message.author === "admin" ? "Eulab" : record.fullName || "Cliente"} · {new Date(message.createdAt).toLocaleString("it-IT")}
                    </p>
                    <p className="whitespace-pre-wrap">{message.body}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={adminChatMessage}
              onChange={(e) => setAdminChatMessage(e.target.value)}
              placeholder="Scrivi una risposta o nota admin..."
              className="min-h-20 flex-1 p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleAddAdminChatMessage}
              disabled={isAddingAdminMessage || !adminChatMessage.trim()}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {isAddingAdminMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Salva
            </button>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border space-y-5 shadow-sm border-t-4 border-t-amber-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Star className="w-5 h-5" /> Recensione scritta
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Una sola scrittura. Modifiche solo dopo sblocco admin nel JSON <code>writtenReview</code>.
              </p>
            </div>
            <button
              onClick={handleSendReviewInvite}
              disabled={isSendingReviewInvite}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {isSendingReviewInvite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Invia mail recensione
            </button>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3 min-h-72">
            {reviewSubmitted ? (
              <>
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Recensione inviata
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {writtenReview.submittedAt ? new Date(writtenReview.submittedAt).toLocaleString("it-IT") : ""}
                  </span>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Autore: {writtenReview.authorName || record.fullName || "Cliente"}</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{writtenReview.text}</p>
                </div>
                {reviewEditRequested && (
                  <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
                    <p className="font-semibold">Il cliente ha richiesto lo sblocco.</p>
                    <p className="mt-1">{writtenReview.editRequestReason}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-10">
                Nessuna recensione ricevuta. Invia la mail per far scrivere il cliente.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleToggleReviewUnlock(true)}
              disabled={isTogglingReviewUnlock || !reviewSubmitted}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              {isTogglingReviewUnlock ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
              Sblocca modifica
            </button>
            <button
              onClick={() => handleToggleReviewUnlock(false)}
              disabled={isTogglingReviewUnlock || !reviewSubmitted}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl flex items-center gap-2 text-sm font-medium disabled:opacity-50"
            >
              <Lock className="w-4 h-4" /> Blocca modifica
            </button>
            {writtenReview.editUnlocked && (
              <span className="inline-flex items-center px-3 py-2 rounded-xl bg-green-50 text-green-700 border border-green-200 text-xs font-semibold">
                Modifica attualmente autorizzata
              </span>
            )}
          </div>
        </div>
      </div>

      {(portalMessage || portalError) && (
        <div className={`p-3 rounded-xl text-sm border ${portalError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"}`}>
          {portalError || portalMessage}
        </div>
      )}

      {/* AI Prompt Section */}
      <div className="bg-card p-6 rounded-2xl border border-border space-y-4 shadow-sm border-t-4 border-t-purple-500">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2 text-purple-700 dark:text-purple-400">
            <Sparkles className="w-5 h-5" /> Generatore Prompt AI
          </h2>
          <button
            onClick={handleGeneratePrompt}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {aiPrompt ? "Rigenera Prompt" : "Genera Prompt"}
          </button>
        </div>

        <textarea
          value={aiPrompt}
          onChange={(e) => {
            setAiPrompt(e.target.value);
            handleDebouncedUpdate(status, internalNotes, e.target.value);
          }}
          className="w-full h-64 p-4 bg-background border border-border rounded-xl font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Clicca 'Genera Prompt' per creare le istruzioni di sviluppo..."
        />

        {aiPrompt && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCopyPrompt}
              className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Copy className="w-4 h-4" /> Copia Appunti
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
