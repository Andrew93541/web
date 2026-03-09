import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CloudDrive - Private Storage",
  description: "Secure, fast, and reliable cloud storage solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white antialiased" suppressHydrationWarning>
      <body className={`${inter.className} h-full overflow-hidden text-slate-900 bg-white`} suppressHydrationWarning>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
