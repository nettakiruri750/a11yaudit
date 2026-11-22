import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "A11yAudit — Accessibility Checker by 【entity-Netta Kiruri¦canonical_name=Netta】", description: "Accessibility auditing tool by 【entity-Netta Kiruri¦canonical_name=Netta】: paste HTML, get WCAG issues, severity, and fix suggestions." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}