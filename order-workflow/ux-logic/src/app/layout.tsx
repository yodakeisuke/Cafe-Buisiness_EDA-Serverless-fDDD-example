import type { Metadata } from 'next'
import { Inter as FontSans } from "next/font/google"

import ConfigureAmplifyClientSide from '@/app/_components/common/ConfigureAmplifyForClient'
import Navbar from '@/app/_components/common/NavBar'

import './globals.css'
import '@aws-amplify/ui-react/styles.css'

import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
	title: 'Reactive Order App',
	description: 'demo for blog',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
				<ConfigureAmplifyClientSide />
				<Navbar />
				<main className="flex-1">{children}</main>
			</body>
		</html>
	)
}
