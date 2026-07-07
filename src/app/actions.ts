"use server";

import { pb, getCollectionName } from "@/lib/pocketbase";
import { sendMail } from "@/lib/mailer";
import {
  confirmationTemplate,
  newLeadNotificationTemplate,
  statusUpdateTemplate,
  previewReadyTemplate,
} from "@/lib/email-templates";

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
  } catch (error: any) {
    console.error("PocketBase submission error:", error);
    return { success: false, error: error.message || "Errore sconosciuto" };
  }
}

export async function updateLead(id: string, data: any) {
  try {
    await pb.collection(getCollectionName()).update(id, data);
    return { success: true };
  } catch (error: any) {
    console.error("PocketBase update error:", error);
    return { success: false, error: error.message || "Errore sconosciuto" };
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
  } catch (error: any) {
    console.error("Failed to send status email:", error);
    return { success: false, error: error.message || "Errore invio email" };
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
  } catch (error: any) {
    console.error("Failed to send preview email:", error);
    return { success: false, error: error.message || "Errore invio email" };
  }
}
