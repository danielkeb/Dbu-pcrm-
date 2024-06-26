import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "website for dbu personal computter managment",
  description: "Dbu Pcms ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
