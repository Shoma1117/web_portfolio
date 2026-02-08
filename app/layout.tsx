import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import SidebarWrapper from "./_components/sidebar/wrapper";
import SidebarContents from "./_components/sidebar/contents"

const mono = JetBrains_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-jetBrainsMono"
});

const noto = Noto_Sans_JP({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-notoSans"
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${mono.variable} ${noto.variable}`}>
      <body className="bg-bg text-text font-base">
        <div className="flex h-screen">
          <SidebarWrapper>
            <SidebarContents />
          </SidebarWrapper>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
