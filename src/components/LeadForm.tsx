"use client";

import { useState, type ReactNode } from "react";
import { useForm, type FieldError } from "react-hook-form";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/app/actions";

type LeadFormData = {
  fullName: string;
  email: string;
  phone: string;
  businessName: string;
  sector: string;
  existingWebsite?: string;
  socialLinks?: string;
  services: string;
  mainGoal: string;
  logoFile?: FileList;
  brandColors: string;
  desiredFont: string;
  brandPersonality: string;
  contentNotes: string;
  additionalNotes?: string;
  consentPrivacy: boolean;
  consentPreviewTerms: boolean;
};

type InputWrapperProps = {
  label: string;
  error?: FieldError;
  children: ReactNode;
  required?: boolean;
};

function InputWrapper({ label, error, children, required }: InputWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Si è verificato un errore durante l’invio. Riprova.";
}

export default function LeadForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const formData = new globalThis.FormData();
      
      // Append all text fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "logoFile" && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append status to 'new'
      formData.append("status", "new");

      // Append logo file if it exists
      if (data.logoFile && data.logoFile.length > 0) {
        formData.append("logoFile", data.logoFile[0]);
      }

      const result = await submitLead(formData);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setIsSuccess(true);
      reset();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h3 className="text-2xl font-bold mb-2">Richiesta inviata!</h3>
        <p className="text-muted-foreground">
          Abbiamo ricevuto le tue informazioni. Ti ricontatteremo a breve per la preview della tua landing.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="mt-8 text-brand-600 font-medium hover:underline"
        >
          Invia un’altra richiesta
        </button>
      </div>
    );
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      {submitError && (
        <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
          {submitError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-x-6">
        <InputWrapper label="Nome e cognome" required error={errors.fullName}>
          <input {...register("fullName", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="Mario Rossi" />
        </InputWrapper>

        <InputWrapper label="Email" required error={errors.email}>
          <input type="email" {...register("email", { required: "Campo obbligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "Email non valida" } })} className={inputClasses} placeholder="mario@esempio.com" />
        </InputWrapper>

        <InputWrapper label="Telefono" required error={errors.phone}>
          <input type="tel" {...register("phone", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="+39 000 000 0000" />
        </InputWrapper>

        <InputWrapper label="Nome attività / brand" required error={errors.businessName}>
          <input {...register("businessName", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="La mia attività" />
        </InputWrapper>

        <InputWrapper label="Settore" required error={errors.sector}>
          <input {...register("sector", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="Es. Ristorazione, Consulenza, ecc." />
        </InputWrapper>

        <InputWrapper label="Sito web esistente (opzionale)" error={errors.existingWebsite}>
          <input {...register("existingWebsite")} className={inputClasses} placeholder="https://..." />
        </InputWrapper>

        <InputWrapper label="Instagram / social (opzionale)" error={errors.socialLinks}>
          <input {...register("socialLinks")} className={inputClasses} placeholder="@tuoprofilo" />
        </InputWrapper>

        <InputWrapper label="Obiettivo principale della landing" required error={errors.mainGoal}>
          <select {...register("mainGoal", { required: "Seleziona un obiettivo" })} className={inputClasses}>
            <option value="">Seleziona...</option>
            <option value="ricevere contatti">Ricevere contatti</option>
            <option value="presentare l’attività">Presentare l’attività</option>
            <option value="vendere un servizio">Vendere un servizio</option>
            <option value="promuovere un’offerta">Promuovere un’offerta</option>
            <option value="prenotazioni">Prenotazioni</option>
            <option value="portfolio">Portfolio</option>
            <option value="altro">Altro</option>
          </select>
        </InputWrapper>
      </div>

      <InputWrapper label="Servizi offerti" required error={errors.services}>
        <textarea {...register("services", { required: "Campo obbligatorio" })} className={inputClasses} rows={3} placeholder="Descrivi brevemente i tuoi servizi principali" />
      </InputWrapper>

      <div className="grid md:grid-cols-2 gap-x-6">
        <InputWrapper label="Colori del brand" required error={errors.brandColors}>
          <input {...register("brandColors", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="Es. Blu e oro, minimal bianco/nero" />
        </InputWrapper>

        <InputWrapper label="Carattere distintivo del brand" required error={errors.brandPersonality}>
          <input {...register("brandPersonality", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="Es. Elegante, giovane, tecnico, ecc." />
        </InputWrapper>
        
        <InputWrapper label="Font o stile desiderato" required error={errors.desiredFont}>
          <input {...register("desiredFont", { required: "Campo obbligatorio" })} className={inputClasses} placeholder="Es. Moderno senza grazie, classico, ecc." />
        </InputWrapper>
        
        <InputWrapper label="Logo" error={errors.logoFile}>
          <input type="file" accept="image/*" {...register("logoFile")} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100" />
        </InputWrapper>
      </div>

      <InputWrapper label="Testi o informazioni da includere" required error={errors.contentNotes}>
        <textarea {...register("contentNotes", { required: "Campo obbligatorio" })} className={inputClasses} rows={3} placeholder="Inserisci il copy o le informazioni essenziali che non possono mancare" />
      </InputWrapper>

      <InputWrapper label="Note aggiuntive (opzionale)" error={errors.additionalNotes}>
        <textarea {...register("additionalNotes")} className={inputClasses} rows={2} placeholder="Altre informazioni utili" />
      </InputWrapper>

      <div className="mt-8 space-y-4 pt-6 border-t border-border">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register("consentPrivacy", { required: "Devi accettare l’informativa sulla privacy" })} className="mt-1 w-5 h-5 rounded border-border text-brand-600 focus:ring-brand-500" />
          <span className="text-sm text-muted-foreground">
            Acconsento al trattamento dei miei dati personali per la gestione della richiesta. {errors.consentPrivacy && <span className="text-red-500 block">{errors.consentPrivacy.message}</span>}
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register("consentPreviewTerms", { required: "Devi accettare le condizioni" })} className="mt-1 w-5 h-5 rounded border-border text-brand-600 focus:ring-brand-500" />
          <span className="text-sm font-medium text-foreground">
            Confermo di aver compreso che la preview iniziale è gratuita, mentre dominio, pubblicazione, modifiche, hosting, integrazioni e servizi aggiuntivi richiedono un contratto di fornitura.
            {errors.consentPreviewTerms && <span className="text-red-500 block">{errors.consentPreviewTerms.message}</span>}
          </span>
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full mt-10 gradient-bg text-white py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
        {isSubmitting ? "Invio in corso..." : "Invia richiesta gratuita"}
      </button>
    </form>
  );
}
