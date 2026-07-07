import Link from "next/link";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white dark:bg-zinc-950 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 font-bold text-xl">
            <Image src="/icon.png" alt="Eulab Icon" width={28} height={28} className="h-7 w-auto object-contain" />
            Eulab Admin
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-brand-600">
            Torna al sito
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
    </div>
  );
}
