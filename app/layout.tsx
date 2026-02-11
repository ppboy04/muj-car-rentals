import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { SessionProvider } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'MUJ Car Rentals - Premium Car Rental Service',
  description: 'Rent premium cars by the hour or day at MUJ. Exclusive student discounts, convenient booking, and reliable service for all your transportation needs.',
  keywords: 'car rental, MUJ, student discount, hourly rental, daily rental, premium cars',
  authors: [{ name: 'MUJ Car Rentals' }],
  creator: 'MUJ Car Rentals',
  publisher: 'MUJ Car Rentals',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://muj-car-rentals.vercel.app'),
  openGraph: {
    title: 'MUJ Car Rentals - Premium Car Rental Service',
    description: 'Rent premium cars by the hour or day at MUJ. Exclusive student discounts, convenient booking, and reliable service.',
    url: 'https://muj-car-rentals.vercel.app',
    siteName: 'MUJ Car Rentals',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MUJ Car Rentals - Premium Car Rental Service',
    description: 'Rent premium cars by the hour or day at MUJ. Exclusive student discounts, convenient booking, and reliable service.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
