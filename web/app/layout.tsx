import type { Metadata } from "next";
import "./globals.css";
import { AppWrapper } from "@/components/UserContext";
import { AuthProvider } from "@/components/authcontext";


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
      <AuthProvider>
     {children}
     </AuthProvider>
     </AppWrapper>
        </body>
      {/* <body>{children}</body> */}

    </html>
  );
}
