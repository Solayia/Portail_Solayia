import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portail Solayia",
  description: "Portail interne Solayia — prospection, développement, e-learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
