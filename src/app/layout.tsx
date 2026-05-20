import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sistem Informasi Akademik SMP",
    template: "%s | Sistem Informasi Akademik SMP",
  },
  description:
    "Sistem Informasi Akademik Sekolah Menengah Pertama — Gestión administrasi akademik sekolah secara digital.",
  keywords: ["akademik", "sekolah", "SMP", "nilai", "absensi", "rapor"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}