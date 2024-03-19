'use client';

import { useMemo } from 'react';
import { UrqlProvider, ssrExchange, cacheExchange, fetchExchange, createClient } from '@urql/next';

import type { Metadata } from "next";
import "./globals.css";
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined'
    });
    const client = createClient({
      url: process.env.APPSYNC_URL || "",
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
      fetchOptions: () => {
        return {
          headers: {
            'x-api-key': process.env.APPSYNC_API_KEY || "",
          },
        };
      },
    });

    return [client, ssr];
  }, []);

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
      <UrqlProvider client={client} ssr={ssr}>
        {children}
      </UrqlProvider>
      </body>
    </html>
  );
}
