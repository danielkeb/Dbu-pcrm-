import type { Metadata } from "next";
import "./globals.css";
import { AppWrapper } from "@/components/UserContext";


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

      <body >
      <AppWrapper>
     {children}
     </AppWrapper>
        </body>
      {/* <body>{children}</body> */}

    </html>
  );
}
