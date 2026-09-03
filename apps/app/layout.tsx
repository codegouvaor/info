import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/context/Providers";
import "../styles/globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Site officiel du gouvernement",
    default: "Site officiel du gouvernement - info.gouv.aor",
  },
  description:
    "Le site officiel du gouvernement Astorien.",
  icons: {
    icon: [
      {
        url: "/gouvernement.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/gouvernement.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/gouvernement.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${publicSans.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
