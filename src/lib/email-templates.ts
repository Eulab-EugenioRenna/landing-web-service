// ─── Shared styles ───────────────────────────────────────────────────────────

const baseStyle = `
  font-family: 'Noto Sans', Arial, Helvetica, sans-serif;
  background-color: #f8f8fa;
  margin: 0;
  padding: 0;
`;

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
`;

const headerStyle = `
  background: linear-gradient(135deg, #7c3aed, #db2777, #f97316);
  padding: 40px 32px;
  text-align: center;
`;

const headerTitle = `
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  font-family: 'Merriweather', Georgia, serif;
`;

const bodyStyle = `
  padding: 32px;
`;

const footerStyle = `
  background-color: #f4f4f5;
  padding: 24px 32px;
  text-align: center;
  font-size: 12px;
  color: #71717a;
`;

const btnStyle = `
  display: inline-block;
  background: linear-gradient(135deg, #7c3aed, #db2777, #f97316);
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 40px;
  border-radius: 999px;
  text-decoration: none;
`;

const labelStyle = `
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
`;

const valueStyle = `
  display: block;
  font-size: 14px;
  color: #09090b;
  margin-bottom: 16px;
`;

const dividerStyle = `
  border: none;
  border-top: 1px solid #e4e4e7;
  margin: 24px 0;
`;

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: "#dbeafe", color: "#1e40af", label: "Nuovo" },
  in_review: { bg: "#fef3c7", color: "#92400e", label: "In analisi" },
  prompt_generated: { bg: "#ede9fe", color: "#5b21b6", label: "Prompt Generato" },
  preview_in_progress: { bg: "#fed7aa", color: "#9a3412", label: "Preview in corso" },
  preview_ready: { bg: "#d1fae5", color: "#065f46", label: "Preview Pronta" },
  contacted: { bg: "#ccfbf1", color: "#115e59", label: "Contattato" },
  converted: { bg: "#d1fae5", color: "#065f46", label: "Convertito" },
  rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rifiutato" },
};

// ─── Template 1: Conferma ricezione dati ─────────────────────────────────────

export function confirmationTemplate(data: {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  sector: string;
  services: string;
  mainGoal: string;
  brandColors: string;
  brandPersonality: string;
  desiredFont: string;
  existingWebsite?: string;
  socialLinks?: string;
  contentNotes?: string;
  additionalNotes?: string;
}) {
  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${baseStyle}">
  <div style="padding: 24px;">
    <div style="${containerStyle}">
      <div style="${headerStyle}">
        <h1 style="${headerTitle}">Richiesta ricevuta! ✨</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 12px 0 0; font-size: 15px;">
          Grazie ${data.fullName}, abbiamo ricevuto i tuoi dati.
        </p>
      </div>

      <div style="${bodyStyle}">
        <p style="font-size: 15px; color: #27272a; line-height: 1.6; margin: 0 0 24px;">
          Ciao <strong>${data.fullName}</strong>,<br><br>
          La tua richiesta di preview gratuita per <strong>${data.businessName}</strong> è stata registrata con successo.
          Il nostro team inizierà a lavorare sulla tua proposta e ti ricontatteremo entro <strong>24-48 ore</strong>.
        </p>

        <h2 style="font-size: 18px; font-weight: 700; color: #09090b; margin: 0 0 16px; font-family: 'Merriweather', Georgia, serif;">
          Riepilogo dei tuoi dati
        </h2>

        <div style="background: #fafafa; border-radius: 12px; padding: 20px; border: 1px solid #e4e4e7;">
          <span style="${labelStyle}">Attività</span>
          <span style="${valueStyle}">${data.businessName}</span>

          <span style="${labelStyle}">Settore</span>
          <span style="${valueStyle}">${data.sector}</span>

          <span style="${labelStyle}">Contatti</span>
          <span style="${valueStyle}">${data.email} · ${data.phone}</span>

          ${data.existingWebsite ? `
          <span style="${labelStyle}">Sito web</span>
          <span style="${valueStyle}">${data.existingWebsite}</span>
          ` : ""}

          ${data.socialLinks ? `
          <span style="${labelStyle}">Social</span>
          <span style="${valueStyle}">${data.socialLinks}</span>
          ` : ""}

          <hr style="${dividerStyle}" />

          <span style="${labelStyle}">Obiettivo principale</span>
          <span style="${valueStyle}">${data.mainGoal}</span>

          <span style="${labelStyle}">Servizi offerti</span>
          <span style="${valueStyle}">${data.services}</span>

          <span style="${labelStyle}">Colori brand</span>
          <span style="${valueStyle}">${data.brandColors}</span>

          <span style="${labelStyle}">Personalità</span>
          <span style="${valueStyle}">${data.brandPersonality}</span>

          <span style="${labelStyle}">Font / Stile</span>
          <span style="${valueStyle}">${data.desiredFont}</span>

          ${data.contentNotes ? `
          <hr style="${dividerStyle}" />
          <span style="${labelStyle}">Contenuti essenziali</span>
          <span style="${valueStyle}">${data.contentNotes}</span>
          ` : ""}

          ${data.additionalNotes ? `
          <span style="${labelStyle}">Note aggiuntive</span>
          <span style="${valueStyle}">${data.additionalNotes}</span>
          ` : ""}
        </div>

        <p style="font-size: 13px; color: #71717a; margin: 24px 0 0; line-height: 1.6;">
          Se hai bisogno di modificare qualcosa, rispondi direttamente a questa email.
        </p>
      </div>

      <div style="${footerStyle}">
        <p style="margin: 0;">© ${new Date().getFullYear()} Eulab · Tutti i diritti riservati</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Template 2: Notifica avanzamento stato ──────────────────────────────────

export function statusUpdateTemplate(data: {
  fullName: string;
  businessName: string;
  newStatus: string;
}) {
  const statusInfo = statusColors[data.newStatus] || { bg: "#f4f4f5", color: "#27272a", label: data.newStatus };

  const statusMessages: Record<string, string> = {
    in_review: "Abbiamo iniziato ad analizzare la tua richiesta. Il nostro team sta studiando il tuo brand e preparando la direzione creativa.",
    prompt_generated: "Abbiamo completato l'analisi e generato le istruzioni per lo sviluppo della tua landing page.",
    preview_in_progress: "Buone notizie! Lo sviluppo della tua preview è iniziato. A breve riceverai un'anteprima consultabile online.",
    preview_ready: "La tua preview è pronta! Presto riceverai il link per vederla in azione.",
    contacted: "Ti abbiamo contattato per discutere i prossimi passi. Controlla le tue comunicazioni.",
    converted: "Benvenuto a bordo! Il tuo progetto è confermato e procederemo con la versione definitiva.",
  };

  const message = statusMessages[data.newStatus] || "Lo stato del tuo progetto è stato aggiornato.";

  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${baseStyle}">
  <div style="padding: 24px;">
    <div style="${containerStyle}">
      <div style="${headerStyle}">
        <h1 style="${headerTitle}">Aggiornamento progetto 🚀</h1>
      </div>

      <div style="${bodyStyle}">
        <p style="font-size: 15px; color: #27272a; line-height: 1.6; margin: 0 0 24px;">
          Ciao <strong>${data.fullName}</strong>,<br><br>
          Abbiamo un aggiornamento sul progetto <strong>${data.businessName}</strong>:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <span style="display: inline-block; background: ${statusInfo.bg}; color: ${statusInfo.color}; font-weight: 700; font-size: 18px; padding: 12px 32px; border-radius: 999px;">
            ${statusInfo.label}
          </span>
        </div>

        <p style="font-size: 15px; color: #27272a; line-height: 1.6; margin: 0 0 24px; text-align: center;">
          ${message}
        </p>

        <p style="font-size: 13px; color: #71717a; margin: 24px 0 0; line-height: 1.6;">
          Per qualsiasi domanda, rispondi direttamente a questa email.
        </p>
      </div>

      <div style="${footerStyle}">
        <p style="margin: 0;">© ${new Date().getFullYear()} Eulab · Tutti i diritti riservati</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Template 3: Consegna preview con link ───────────────────────────────────

export function previewReadyTemplate(data: {
  fullName: string;
  businessName: string;
  previewUrl: string;
}) {
  return `
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${baseStyle}">
  <div style="padding: 24px;">
    <div style="${containerStyle}">
      <div style="${headerStyle}">
        <h1 style="${headerTitle}">La tua preview è online! 🎉</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 12px 0 0; font-size: 15px;">
          ${data.businessName}
        </p>
      </div>

      <div style="${bodyStyle}">
        <p style="font-size: 15px; color: #27272a; line-height: 1.6; margin: 0 0 24px;">
          Ciao <strong>${data.fullName}</strong>,<br><br>
          Siamo lieti di comunicarti che la preview della tua landing page per <strong>${data.businessName}</strong> è pronta e consultabile online!
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.previewUrl}" target="_blank" style="${btnStyle}">
            Visualizza la tua preview →
          </a>
        </div>

        <div style="background: #fafafa; border-radius: 12px; padding: 16px 20px; border: 1px solid #e4e4e7; text-align: center;">
          <span style="${labelStyle}">URL della preview</span>
          <a href="${data.previewUrl}" style="color: #7c3aed; font-size: 14px; word-break: break-all;">
            ${data.previewUrl}
          </a>
        </div>

        <p style="font-size: 15px; color: #27272a; line-height: 1.6; margin: 24px 0;">
          Questa è una prima proposta gratuita basata sulle informazioni che ci hai fornito.
          Se ti piace e vuoi procedere con la versione definitiva (dominio, hosting, modifiche personalizzate),
          saremo felici di proporti un piano su misura.
        </p>

        <p style="font-size: 13px; color: #71717a; margin: 24px 0 0; line-height: 1.6;">
          Rispondi a questa email per qualsiasi feedback o domanda.
        </p>
      </div>

      <div style="${footerStyle}">
        <p style="margin: 0;">© ${new Date().getFullYear()} Eulab · Tutti i diritti riservati</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
