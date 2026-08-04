import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getContent } from "@/lib/content";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: "Coding Spy — Decode. Learn. Master.",
  description:
    "Coding Spy is an interactive tutorial platform for learning to code — case files, a live lab playground, quizzes, and agent certification.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Coding Spy",
    description: "Decode. Learn. Master.",
    type: "website",
  },
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('coding-spy-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.classList.toggle('dark', t === 'dark');
  } catch (e) {}
})();
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <Providers content={content}>{children}</Providers>
      </body>
    </html>
  );
}
