import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "@/Providers/AuthProvider";
import { ToastContainer } from "react-toastify";
import QueryProvider from "@/Providers/QueryProvider";

export const metadata: Metadata = {
  title: "Dashboard Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={``}>
          <QueryProvider>
            {children}
          </QueryProvider>
          <ToastContainer />
        </body>
      </AuthProvider>
    </html>
  );
}
