import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navbar from "@/components/Navbar";
import RegisterServiceWorker from "./register-sw";

export const metadata: Metadata = {
  title: "Gharu Hiraa - School Management System",
  description: "School Management System for Gharu Hiraa School for Quranic Memorization",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gharu Hiraa",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body>
        <ErrorBoundary>
          <SessionProvider>
            <ToastProvider>
              <RegisterServiceWorker />
              <Navbar />
              {children}
            </ToastProvider>
          </SessionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

