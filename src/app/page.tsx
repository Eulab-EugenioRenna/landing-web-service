import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, XCircle, Rocket, Target, Users, Zap, Briefcase } from "lucide-react";
import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#fdfdfd] dark:bg-zinc-950">
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Large pink/red angled shape similar to the first reference */}
        <div className="absolute -right-[20%] top-[10%] w-[80%] h-[120%] bg-gradient-to-tr from-accent-600 via-accent-500 to-warm-500 rounded-[100px] rotate-[-15deg] opacity-[0.85] blur-[2px] dark:opacity-40" />
        {/* Soft purple blob on the left */}
        <div className="absolute -left-[10%] top-[20%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[100px]" />
        {/* Curved path line (SVG) */}
        <svg className="absolute top-[30%] left-0 w-full h-[400px] opacity-30 dark:opacity-20" preserveAspectRatio="none" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100 300 C 200 400, 400 100, 800 200 C 1200 300, 1400 50, 1600 100" stroke="url(#paint0_linear)" strokeWidth="4" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="200" x2="1440" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#7c3aed" />
              <stop offset="1" stopColor="#db2777" />
            </linearGradient>
          </defs>
        </svg>
        {/* Decorative Circles on the path */}
        <div className="absolute top-[45%] left-[10%] w-8 h-8 rounded-full bg-brand-900 shadow-xl" />
        <div className="absolute top-[48%] left-[20%] w-16 h-16 rounded-full border-4 border-brand-500 bg-transparent" />
        <div className="absolute top-[38%] left-[45%] w-12 h-12 rounded-full bg-brand-600 shadow-[0_0_30px_rgba(124,58,237,0.6)]" />
        <div className="absolute top-[25%] left-[65%] w-20 h-20 rounded-full border-4 border-[#34d399] bg-transparent" />
      </div>

      <header className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
          <Link href="/" className="flex items-center">
            <Image src="/eulab-logo.png" alt="Eulab Logo" width={120} height={38} className="h-9 w-auto brightness-0 invert" />
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-bold text-foreground/80">
            <Link href="#per-chi-e" className="hover:text-brand-600 transition-colors">Per chi è</Link>
            <Link href="#come-funziona" className="hover:text-brand-600 transition-colors">Come funziona</Link>
            <Link href="#cosa-ricevi" className="hover:text-brand-600 transition-colors">Cosa ricevi</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="#richiedi-preview" className="gradient-bg px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Richiedi Preview
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48">
          <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 pr-8 md:pr-16 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-md border border-brand-100 dark:border-brand-900 text-brand-600 font-bold mb-8 text-sm">
                <Clock className="w-4 h-4" />
                <span>Consegna stimata in 24-48 ore</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-foreground">
                LA TUA LANDING <br />
                <span className="gradient-text">GRATIS IN 24 ORE</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mb-12 font-medium leading-relaxed">
                Mandaci logo, colori, servizi e obiettivo: prepariamo una preview gratuita del tuo sito one page in 24-48 ore.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-white dark:bg-zinc-900 p-2 rounded-full shadow-xl border border-border/50 max-w-lg">
                <div className="flex-1 px-6 font-medium text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                  Pronto per iniziare?
                </div>
                <Link href="#richiedi-preview" className="w-full sm:w-auto gradient-bg px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg">
                  Richiedi Preview
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            
            <div className="md:w-2/5 mt-16 md:mt-0 relative hidden md:block">
              {/* Optional: Add a hero image here if needed, currently using CSS shapes */}
            </div>
          </div>
        </section>

        {/* Per Chi È */}
        <section id="per-chi-e" className="py-32 relative">
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/3">
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">We are the solution <br/> for IT problems.</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Hai bisogno di una presenza online chiara, veloce e professionale? Eulab crea una prima preview della tua landing page partendo dalle informazioni essenziali della tua attività.
                </p>
                <Link href="#richiedi-preview" className="gradient-bg px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all inline-flex">
                  Get in Touch
                </Link>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Briefcase, text: "Professionisti" },
                  { icon: Target, text: "Attività locali" },
                  { icon: Users, text: "Negozi" },
                  { icon: Zap, text: "Consulenti" },
                  { icon: Rocket, text: "Freelance" },
                  { icon: Users, text: "Studi" },
                  { icon: Target, text: "Piccole aziende" },
                  { icon: Briefcase, text: "Brand personali" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center p-8 bg-white dark:bg-zinc-900 rounded-3xl card-shadow border border-border/50 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mb-5 shadow-lg">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="font-bold text-center">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cosa ricevi gratis */}
        <section id="cosa-ricevi" className="py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-50/50 dark:to-zinc-900/50 z-0" />
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Cosa ricevi (e cosa no)</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Chiarezza fin dal primo momento sui servizi offerti gratuitamente e su quelli inclusi nel contratto.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-zinc-900 p-10 md:p-12 rounded-[40px] card-shadow border-2 border-brand-100 dark:border-zinc-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-[100px]" />
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-2xl text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Incluso gratis</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Proposta iniziale di landing one page",
                    "Struttura della pagina ottimizzata",
                    "Copy iniziale di base",
                    "Proposta visiva coerente con il brand",
                    "Call to action orientata all’obiettivo",
                    "Prima anteprima consultabile online"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg font-medium">
                      <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-10 md:p-12 rounded-[40px] card-shadow border-2 border-red-50 dark:border-zinc-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-[100px]" />
                <div className="inline-flex items-center gap-3 mb-8">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-2xl text-red-600 dark:text-red-400">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Non incluso</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Dominio personalizzato & Hosting",
                    "Modifiche avanzate o illimitate",
                    "Integrazioni personalizzate",
                    "SEO avanzata",
                    "Pubblicazione ufficiale & Manutenzione"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg font-medium text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                {/* <div className="mt-10 p-6 bg-brand-50 dark:bg-brand-900/20 rounded-3xl border border-brand-100 dark:border-brand-900/50 flex gap-4">
                  <Info className="w-6 h-6 text-brand-600 shrink-0" />
                  <p className="text-sm font-medium text-brand-900 dark:text-brand-100">
                    Per questi servizi ti proporremo un contratto di fornitura Eulab trasparente.
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Come funziona & Banner */}
        <section id="come-funziona" className="py-32 relative">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Colorful Banner */}
            <div className="gradient-bg rounded-[40px] p-12 md:p-16 mb-24 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
              
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-black text-white mb-4">Advance Innovation <br/> For IT Solutions.</h3>
                <p className="text-white/80 text-lg max-w-lg">Siamo il partner ideale per far decollare il tuo business con le ultime tecnologie web.</p>
              </div>
              <Link href="#richiedi-preview" className="relative z-10 bg-white text-brand-600 px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-lg">
                Richiedi Ora
              </Link>
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-16 text-center">Come funziona</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: "Compili il form", desc: "Inserisci logo, colori e obiettivo." },
                { title: "Analizziamo", desc: "Prepariamo una direzione creativa." },
                { title: "Creiamo", desc: "Prima proposta in 24-48 ore." },
                { title: "Decidi", desc: "Scegli se procedere con il contratto." }
              ].map((step, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl card-shadow border border-border/50 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center font-black text-2xl text-white mb-6 shadow-lg">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Lead */}
        <section id="richiedi-preview" className="py-32 relative">
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Inizia da qui.</h2>
              <p className="text-xl text-muted-foreground">
                Raccontaci la tua attività. Più informazioni ci dai, più la preview sarà vicina alla tua identità.
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 p-8 md:p-14 rounded-[40px] card-shadow border border-border/50">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 bg-white dark:bg-zinc-950 border-t border-border/50">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <Image src="/icon.png" alt="Eulab Icon" width={56} height={56} className="h-14 w-auto object-contain mb-8" />
          <div className="flex gap-6 mb-8 text-sm font-bold text-muted-foreground">
            {/* <Link href="#" className="hover:text-brand-600">Privacy Policy</Link>
            <Link href="#" className="hover:text-brand-600">Terms of Service</Link> */}
            <Link href="#richiedi-preview" className="hover:text-brand-600">Contact Us</Link>
          </div>
          <p className="text-muted-foreground font-medium">© {new Date().getFullYear()} Eulab. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}
