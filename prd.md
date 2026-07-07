Crea una web app/landing page per **Eulab** dedicata al servizio:

**“La tua landing gratis in 24 ore”**

Il progetto deve presentare un servizio commerciale per attività locali, professionisti, freelance, consulenti, negozi, studi e piccole aziende che vogliono ricevere una **preview gratuita** di un sito web one page/landing page in tempi rapidi.

## Obiettivo della pagina

La landing deve spiegare in modo chiaro, elegante e professionale che Eulab realizza una **preview gratuita** di una landing page/sito web one page per attività e professionisti, con consegna stimata in **24-48 ore**.

Deve essere molto chiaro che:

* la preview iniziale è gratuita;
* la preview serve a mostrare una prima proposta grafica, testuale e strutturale;
* per pubblicare il sito su dominio personalizzato, richiedere modifiche, aggiunte, manutenzione, hosting, SEO, integrazioni o sviluppi successivi, il cliente dovrà sottoscrivere un **contratto di fornitura con Eulab**;
* il servizio gratuito non include automaticamente dominio, hosting definitivo, gestione continuativa o revisioni illimitate.

Il tono deve essere moderno, diretto, trasparente e orientato alla conversione.

## Stack tecnico desiderato

Realizza il progetto con:

* Next.js / React
* TypeScript
* Tailwind CSS
* form collegato a PocketBase
* area admin in route separata
* integrazione AI locale tramite Ollama per generare un prompt di sviluppo sito web a partire dalla richiesta del lead

Usa componenti puliti, responsive e riutilizzabili.

## Struttura landing page

La pagina principale deve essere accessibile da `/`.

### Hero section

Titolo forte:

**La tua landing gratis in 24 ore**

Sottotitolo:

**Mandaci logo, colori, servizi e obiettivo: prepariamo una preview gratuita del tuo sito one page in 24-48 ore.**

CTA principale:

**Richiedi la tua preview gratuita**

CTA secondaria:

**Scopri come funziona**

Inserire micro-copy sotto la CTA:

**La preview è gratuita. Dominio, modifiche, pubblicazione e servizi aggiuntivi richiedono un contratto di fornitura.**

La hero deve avere uno stile moderno, professionale, tech ma accessibile. Usare gradienti leggeri, card, elementi visuali e un layout pulito.

### Sezione “Per chi è”

Creare una sezione che spiega che il servizio è adatto a:

* professionisti
* attività locali
* negozi
* consulenti
* freelance
* studi professionali
* piccole aziende
* brand personali
* servizi digitali

Testo guida:

**Hai bisogno di una presenza online chiara, veloce e professionale? Eulab crea una prima preview della tua landing page partendo dalle informazioni essenziali della tua attività.**

### Sezione “Cosa ricevi gratis”

Spiegare che il cliente riceve:

* una proposta iniziale di landing one page;
* struttura della pagina;
* copy iniziale;
* proposta visiva coerente con logo, colori e stile del brand;
* call to action orientata all’obiettivo;
* prima anteprima consultabile.

Specificare che non sono inclusi nella parte gratuita:

* dominio personalizzato;
* hosting definitivo;
* modifiche avanzate;
* integrazioni personalizzate;
* SEO avanzata;
* gestione continuativa;
* pubblicazione ufficiale;
* manutenzione.

### Sezione “Come funziona”

Creare 4 step:

1. **Compili il form**
   Inserisci nome attività, logo, colori, servizi e obiettivo.

2. **Analizziamo la richiesta**
   Eulab raccoglie le informazioni e prepara una direzione creativa.

3. **Creiamo la preview**
   Entro 24-48 ore viene generata una prima proposta di landing one page.

4. **Decidi come procedere**
   Per pubblicazione, dominio, modifiche e servizi aggiuntivi viene proposto un contratto di fornitura.

### Sezione “Perché Eulab”

Descrivere Eulab come realtà che unisce:

* sviluppo web;
* design;
* automazioni;
* intelligenza artificiale;
* consulenza digitale;
* attenzione alle esigenze reali del cliente.

Copy suggerito:

**Non realizziamo solo pagine belle da vedere. Costruiamo strumenti digitali pensati per presentare meglio la tua attività, raccogliere contatti e trasformare una visita in una richiesta concreta.**

### Sezione form lead

Creare un form con titolo:

**Richiedi la tua preview gratuita**

Descrizione:

**Raccontaci la tua attività. Più informazioni ci dai, più la preview sarà vicina alla tua identità.**

Campi del form:

* Nome e cognome
* Email
* Telefono
* Nome attività / brand
* Settore
* Sito web esistente, opzionale
* Instagram / social, opzionale
* Servizi offerti
* Obiettivo principale della landing
  Opzioni suggerite:

  * ricevere contatti
  * presentare l’attività
  * vendere un servizio
  * promuovere un’offerta
  * prenotazioni
  * portfolio
  * altro
* Upload logo
* Colori del brand
* Font o stile desiderato
* Carattere distintivo del brand
  Esempi: elegante, giovane, premium, artigianale, tecnico, istituzionale, creativo, minimal
* Testi o informazioni da includere
* Note aggiuntive
* Checkbox privacy/consenso
* Checkbox di conferma con testo:
  **Confermo di aver compreso che la preview iniziale è gratuita, mentre dominio, pubblicazione, modifiche, hosting, integrazioni e servizi aggiuntivi richiedono un contratto di fornitura.**

CTA form:

**Invia richiesta gratuita**

Dopo l’invio mostrare messaggio:

**Richiesta inviata! Abbiamo ricevuto le informazioni. Ti ricontatteremo per la preview della tua landing.**

## Integrazione PocketBase

Il form deve salvare i dati in una istanza PocketBase attiva.

Prevedere una collection chiamata:

`landing_requests`

Campi suggeriti:

* id
* created
* updated
* fullName
* email
* phone
* businessName
* sector
* existingWebsite
* socialLinks
* services
* mainGoal
* logoFile
* brandColors
* desiredFont
* brandPersonality
* contentNotes
* additionalNotes
* consentPrivacy
* consentPreviewTerms
* status
* aiPrompt
* internalNotes

Valori possibili per `status`:

* new
* in_review
* prompt_generated
* preview_in_progress
* preview_ready
* contacted
* converted
* rejected

Gestire gli errori del form in modo chiaro.

Non esporre credenziali sensibili nel frontend. Usare variabili ambiente per URL PocketBase ed eventuali chiavi/configurazioni.

## Area admin

Creare una route separata:

`/admin`

L’area admin deve mostrare la lista delle richieste ricevute da PocketBase.

Per ogni richiesta mostrare:

* nome attività
* nome referente
* email
* telefono
* settore
* obiettivo
* data richiesta
* stato
* pulsante “Vedi dettagli”

Nella pagina dettaglio richiesta, mostrare tutte le informazioni raccolte e il logo caricato.

Aggiungere azioni admin:

* modifica stato richiesta
* aggiungi note interne
* genera prompt AI
* copia prompt
* salva prompt generato nel record PocketBase

## Funzione AI con Ollama

Nell’admin aggiungere una funzione assistita da intelligenza artificiale tramite Ollama.

La funzione deve prendere i dati della richiesta e generare un **prompt di sviluppo sito web** pronto da copiare e incollare in un coding agent o in un generatore di landing.

Il prompt generato deve includere:

* descrizione dell’attività
* settore
* obiettivo della landing
* servizi offerti
* tono comunicativo
* identità visiva
* colori
* font/stile
* struttura consigliata della landing
* sezioni da creare
* CTA
* contenuti da valorizzare
* indicazioni UX/UI
* indicazioni responsive
* eventuali note tecniche
* vincoli e preferenze del cliente

Aggiungere pulsante:

**Genera prompt sviluppo**

Dopo la generazione mostrare una textarea o editor leggibile con il prompt.

Aggiungere pulsante:

**Copia prompt**

Aggiungere pulsante:

**Salva prompt**

## Prompt interno per Ollama

Quando viene chiamata Ollama, usare un prompt simile a questo:

“Sei un consulente digitale, UX strategist, copywriter e prompt engineer per sviluppo web. Devi trasformare la richiesta di un lead in un prompt completo per creare una landing page professionale one page. Usa solo le informazioni fornite dal cliente. Se mancano dati, proponi assunzioni ragionevoli ma segnala cosa andrebbe confermato. Il prompt finale deve essere chiaro, operativo e pronto per un coding agent. Deve includere struttura della pagina, tono, sezioni, CTA, stile visivo, contenuti, obiettivo conversione e indicazioni tecniche. Non generare codice, genera solo il prompt di sviluppo.”

## Stile visuale

La landing deve avere un look:

* moderno
* premium ma accessibile
* chiaro
* tecnologico
* professionale
* adatto a Eulab

Usare:

* hero forte
* sezioni alternate
* card con bordi morbidi
* gradienti leggeri
* icone semplici
* CTA evidenti
* form ben ordinato
* animazioni leggere
* responsive mobile-first

## Copy importante da includere

Inserire una sezione o box informativo con questo messaggio:

**Trasparenza sul servizio gratuito**

**La preview gratuita serve a mostrarti una prima proposta di sito one page per la tua attività. La pubblicazione online, il dominio personalizzato, le modifiche richieste, l’hosting, la manutenzione, la SEO, le integrazioni e ogni servizio successivo saranno regolati da un contratto di fornitura Eulab.**

## Requisiti finali

Il risultato deve includere:

* landing completa `/`
* form lead collegato a PocketBase
* upload logo
* salvataggio richiesta
* pagina admin `/admin`
* lista richieste
* dettaglio richiesta
* cambio stato
* generazione prompt AI con Ollama
* copia prompt
* salvataggio prompt su PocketBase
* UI responsive
* gestione errori
* variabili ambiente documentate
* struttura codice pulita

Genera il codice completo del progetto, con componenti separati, istruzioni di configurazione e commenti solo dove servono.
