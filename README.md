This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Configurazione progetto

Variabili ambiente principali:

```bash
POCKETBASE_URL=https://...
NEXT_PUBLIC_POCKETBASE_URL=https://...
POCKETBASE_COLLECTION=eulab_web_lead
APP_URL=https://tuo-dominio.it
NEXT_PUBLIC_APP_URL=https://tuo-dominio.it
ADMIN_EMAIL=admin@esempio.it
SMTP_HOST=smtp...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=Eulab <noreply@esempio.it>
```

Per le funzioni cliente aggiungere alla collection PocketBase due campi JSON:

- `clientChat`: contiene token invito e messaggi chat tra admin e cliente.
- `writtenReview`: contiene token invito, recensione, stato blocco/sblocco e richiesta modifica.

L'admin può inviare le email da `/admin/[id]`. I link pubblici generati usano `APP_URL` / `NEXT_PUBLIC_APP_URL` e puntano a:

- `/cliente/[id]/note?token=...`
- `/cliente/[id]/recensione?token=...`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
