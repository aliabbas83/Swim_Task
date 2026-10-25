import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { PoolBackground } from "@/components/brand/PoolBackground";
import { RegistrationProvider } from "@/features/registration/state/RegistrationProvider";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-fredoka", display: "swap" });
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "The Dolphins Registration", template: "%s | The Dolphins" },
  description: "Register your children for The Dolphins summer swimming courses.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a4a75",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <PoolBackground />
        {/* One provider for the whole wizard: state survives navigation between steps. */}
        <RegistrationProvider>{children}</RegistrationProvider>
      </body>
    </html>
  );
}
