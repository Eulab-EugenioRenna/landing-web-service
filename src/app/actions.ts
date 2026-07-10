"use server";

import { pb, getCollectionName } from "@/lib/pocketbase";
import { sendMail } from "@/lib/mailer";
import {
  confirmationTemplate,
  newLeadNotificationTemplate,
  statusUpdateTemplate,
  previewReadyTemplate,
  clientChatInviteTemplate,
  reviewInviteTemplate,
} from "@/lib/email-templates";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export type ClientChatMessage = {
  id: string;
  author: "admin" | "client";
  body: string;
  createdAt: string;
};

export type ClientChatData = {
  token?: string;
  invitedAt?: string;
  messages?: ClientChatMessage[];
};

export type WrittenReviewData = {
  token?: string;
  invitedAt?: string;
  authorName?: string;
  text?: string;
  submittedAt?: string;
  updatedAt?: string;
  editUnlocked?: boolean;
  editRequestedAt?: string;
  editRequestReason?: string;
};

type LeadPortalRecord = {
  id: string;
  fullName?: string;
  email?: string;
  businessName?: string;
  clientChat?: ClientChatData;
  writtenReview?: WrittenReviewData;
};

function createToken() {
  return crypto.randomUUID().replaceAll("-", "");
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function normalizeChat(value: unknown): ClientChatData {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { messages: [] };

  const chat = value as ClientChatData;
  return {
    ...chat,
    messages: Array.isArray(chat.messages) ? chat.messages : [],
  };
}

function normalizeReview(value: unknown): WrittenReviewData {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as WrittenReviewData;
}

async function getLeadPortalRecord(id: string) {
  return pb.collection(getCollectionName()).getOne<LeadPortalRecord>(id);
}

async function updateClientChat(id: string, clientChat: ClientChatData) {
  await pb.collection(getCollectionName()).update(id, { clientChat });
  return clientChat;
}

async function updateWrittenReview(id: string, writtenReview: WrittenReviewData) {
  await pb.collection(getCollectionName()).update(id, { writtenReview });
  return writtenReview;
}

// ─── Lead CRUD ───────────────────────────────────────────────────────────────

export async function submitLead(formData: FormData) {
  try {
    const record = await pb.collection(getCollectionName()).create(formData);

    const leadData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      businessName: formData.get("businessName") as string,
      sector: formData.get("sector") as string,
      services: formData.get("services") as string,
      mainGoal: formData.get("mainGoal") as string,
      brandColors: formData.get("brandColors") as string,
      brandPersonality: formData.get("brandPersonality") as string,
      desiredFont: formData.get("desiredFont") as string,
      existingWebsite: (formData.get("existingWebsite") as string) || undefined,
      socialLinks: (formData.get("socialLinks") as string) || undefined,
      contentNotes: (formData.get("contentNotes") as string) || undefined,
      additionalNotes: (formData.get("additionalNotes") as string) || undefined,
    };

    // Send confirmation and internal notification automatically.
    // Don't fail the submission if one of the emails fails.
    const emailTasks = [
      sendMail(
        "eugeniorenna92@gmail.com",
        "Nuovo contatto dal form – Eulab",
        newLeadNotificationTemplate({ ...leadData, recordId: record.id })
      ),
    ];

    if (leadData.email) {
      emailTasks.push(
        sendMail(
          leadData.email,
          "Richiesta ricevuta – Eulab Preview Gratuita",
          confirmationTemplate(leadData)
        )
      );
    }

    const emailResults = await Promise.allSettled(emailTasks);
    emailResults.forEach((result, index) => {
      if (result.status === "rejected") {
        const label = index === 0 ? "internal lead notification" : "confirmation email";
        console.error(`Failed to send ${label}:`, result.reason);
      }
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("PocketBase submission error:", error);
    return { success: false, error: getErrorMessage(error, "Errore sconosciuto") };
  }
}

export async function updateLead(id: string, data: Record<string, unknown>) {
  try {
    await pb.collection(getCollectionName()).update(id, data);
    return { success: true };
  } catch (error: unknown) {
    console.error("PocketBase update error:", error);
    return { success: false, error: getErrorMessage(error, "Errore sconosciuto") };
  }
}

// ─── Email Actions ───────────────────────────────────────────────────────────

export async function sendStatusEmail(
  email: string,
  fullName: string,
  businessName: string,
  newStatus: string
) {
  try {
    await sendMail(
      email,
      `Aggiornamento progetto ${businessName} – Eulab`,
      statusUpdateTemplate({ fullName, businessName, newStatus })
    );
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to send status email:", error);
    return { success: false, error: getErrorMessage(error, "Errore invio email") };
  }
}

export async function sendPreviewEmail(
  email: string,
  fullName: string,
  businessName: string,
  previewUrl: string,
  recordId: string
) {
  try {
    await sendMail(
      email,
      `La tua preview è online! – ${businessName}`,
      previewReadyTemplate({ fullName, businessName, previewUrl })
    );

    // Save the previewUrl to the record
    await pb.collection(getCollectionName()).update(recordId, { previewUrl });

    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to send preview email:", error);
    return { success: false, error: getErrorMessage(error, "Errore invio email") };
  }
}

// ─── Client notes chat ──────────────────────────────────────────────────────

export async function sendClientChatInviteEmail(recordId: string) {
  try {
    const record = await getLeadPortalRecord(recordId);
    if (!record.email) throw new Error("Email cliente mancante");

    const currentChat = normalizeChat(record.clientChat);
    const clientChat: ClientChatData = {
      ...currentChat,
      token: currentChat.token || createToken(),
      invitedAt: new Date().toISOString(),
    };

    await updateClientChat(recordId, clientChat);

    const chatUrl = `${getAppUrl()}/cliente/${recordId}/note?token=${clientChat.token}`;
    await sendMail(
      record.email,
      `Lascia le tue note per ${record.businessName || "il progetto"} – Eulab`,
      clientChatInviteTemplate({
        fullName: record.fullName || "",
        businessName: record.businessName || "il tuo progetto",
        chatUrl,
      })
    );

    return { success: true, clientChat, chatUrl };
  } catch (error: unknown) {
    console.error("Failed to send client chat invite:", error);
    return { success: false, error: getErrorMessage(error, "Errore invio email note") };
  }
}

export async function addAdminChatMessage(recordId: string, message: string) {
  try {
    const cleanMessage = message.trim();
    if (!cleanMessage) throw new Error("Scrivi un messaggio prima di inviare");

    const record = await getLeadPortalRecord(recordId);
    const currentChat = normalizeChat(record.clientChat);
    const clientChat: ClientChatData = {
      ...currentChat,
      messages: [
        ...(currentChat.messages || []),
        {
          id: createMessageId(),
          author: "admin",
          body: cleanMessage,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    await updateClientChat(recordId, clientChat);
    return { success: true, clientChat };
  } catch (error: unknown) {
    console.error("Failed to add admin chat message:", error);
    return { success: false, error: getErrorMessage(error, "Errore salvataggio messaggio") };
  }
}

export async function addClientChatMessage(recordId: string, token: string, message: string) {
  try {
    const cleanMessage = message.trim();
    if (!cleanMessage) throw new Error("Scrivi una nota prima di inviare");

    const record = await getLeadPortalRecord(recordId);
    const currentChat = normalizeChat(record.clientChat);

    if (!currentChat.token || currentChat.token !== token) {
      throw new Error("Link note non valido o scaduto");
    }

    const clientChat: ClientChatData = {
      ...currentChat,
      messages: [
        ...(currentChat.messages || []),
        {
          id: createMessageId(),
          author: "client",
          body: cleanMessage,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    await updateClientChat(recordId, clientChat);
    return { success: true, clientChat };
  } catch (error: unknown) {
    console.error("Failed to add client chat message:", error);
    return { success: false, error: getErrorMessage(error, "Errore salvataggio nota") };
  }
}

// ─── Written review ─────────────────────────────────────────────────────────

export async function sendReviewInviteEmail(recordId: string) {
  try {
    const record = await getLeadPortalRecord(recordId);
    if (!record.email) throw new Error("Email cliente mancante");

    const currentReview = normalizeReview(record.writtenReview);
    const writtenReview: WrittenReviewData = {
      ...currentReview,
      token: currentReview.token || createToken(),
      invitedAt: new Date().toISOString(),
      editUnlocked: Boolean(currentReview.editUnlocked),
    };

    await updateWrittenReview(recordId, writtenReview);

    const reviewUrl = `${getAppUrl()}/cliente/${recordId}/recensione?token=${writtenReview.token}`;
    await sendMail(
      record.email,
      `Lascia la tua recensione per ${record.businessName || "Eulab"}`,
      reviewInviteTemplate({
        fullName: record.fullName || "",
        businessName: record.businessName || "il tuo progetto",
        reviewUrl,
      })
    );

    return { success: true, writtenReview, reviewUrl };
  } catch (error: unknown) {
    console.error("Failed to send review invite:", error);
    return { success: false, error: getErrorMessage(error, "Errore invio email recensione") };
  }
}

export async function submitClientReview(
  recordId: string,
  token: string,
  authorName: string,
  reviewText: string
) {
  try {
    const cleanText = reviewText.trim();
    if (cleanText.length < 10) throw new Error("La recensione deve contenere almeno 10 caratteri");

    const record = await getLeadPortalRecord(recordId);
    const currentReview = normalizeReview(record.writtenReview);

    if (!currentReview.token || currentReview.token !== token) {
      throw new Error("Link recensione non valido o scaduto");
    }

    const alreadySubmitted = Boolean(currentReview.text && currentReview.submittedAt);
    if (alreadySubmitted && !currentReview.editUnlocked) {
      throw new Error("La recensione è già stata inviata. Puoi richiedere lo sblocco per modificarla.");
    }

    const now = new Date().toISOString();
    const writtenReview: WrittenReviewData = {
      ...currentReview,
      authorName: authorName.trim() || record.fullName || "Cliente",
      text: cleanText,
      submittedAt: currentReview.submittedAt || now,
      updatedAt: alreadySubmitted ? now : undefined,
      editUnlocked: false,
      editRequestedAt: undefined,
      editRequestReason: undefined,
    };

    await updateWrittenReview(recordId, writtenReview);
    return { success: true, writtenReview };
  } catch (error: unknown) {
    console.error("Failed to submit review:", error);
    return { success: false, error: getErrorMessage(error, "Errore salvataggio recensione") };
  }
}

export async function requestReviewUnlock(recordId: string, token: string, reason: string) {
  try {
    const record = await getLeadPortalRecord(recordId);
    const currentReview = normalizeReview(record.writtenReview);

    if (!currentReview.token || currentReview.token !== token) {
      throw new Error("Link recensione non valido o scaduto");
    }

    if (!currentReview.text || !currentReview.submittedAt) {
      throw new Error("La recensione non è ancora stata inviata");
    }

    const writtenReview: WrittenReviewData = {
      ...currentReview,
      editRequestedAt: new Date().toISOString(),
      editRequestReason: reason.trim() || "Il cliente richiede la modifica della recensione.",
    };

    await updateWrittenReview(recordId, writtenReview);

    const adminEmail = process.env.ADMIN_EMAIL || "eugeniorenna92@gmail.com";
    await sendMail(
      adminEmail,
      `Richiesta sblocco recensione – ${record.businessName || record.fullName || recordId}`,
      `<p>Il cliente ha richiesto lo sblocco della recensione.</p><p><strong>Motivo:</strong> ${writtenReview.editRequestReason}</p><p>Apri l'admin per autorizzare la modifica.</p>`
    );

    return { success: true, writtenReview };
  } catch (error: unknown) {
    console.error("Failed to request review unlock:", error);
    return { success: false, error: getErrorMessage(error, "Errore richiesta sblocco") };
  }
}

export async function setReviewEditUnlock(recordId: string, unlocked: boolean) {
  try {
    const record = await getLeadPortalRecord(recordId);
    const currentReview = normalizeReview(record.writtenReview);
    const writtenReview: WrittenReviewData = {
      ...currentReview,
      editUnlocked: unlocked,
      editRequestedAt: unlocked ? currentReview.editRequestedAt : undefined,
      editRequestReason: unlocked ? currentReview.editRequestReason : undefined,
    };

    await updateWrittenReview(recordId, writtenReview);
    return { success: true, writtenReview };
  } catch (error: unknown) {
    console.error("Failed to set review unlock:", error);
    return { success: false, error: getErrorMessage(error, "Errore aggiornamento sblocco") };
  }
}
