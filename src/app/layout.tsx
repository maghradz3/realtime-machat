import type { Metadata } from "next";

import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import LayoutProvider from "@/providers/layout-provider";
import ThemeProvider from "@/providers/theme-provider";
import ReduxProvider from "@/providers/redux-provider";
import ToasterProvider from "@/providers/toaster-provider";

export const metadata: Metadata = {
  title: "machat app",
  description: "Real-time chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeProvider>
            <ReduxProvider>
              <ToasterProvider />
              <LayoutProvider>{children}</LayoutProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
