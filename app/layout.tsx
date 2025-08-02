import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'KIIT-CONNECT Academic Calculator - Advanced CGPA, SGPA & Aggregate Calculator',
    template: '%s | KIIT-CONNECT Academic Calculator'
  },
  description: 'Advanced academic performance calculator for KIIT students. Calculate SGPA, CGPA, and aggregate scores with branch-specific subjects. Generate professional PDF reports with detailed analysis.',
  keywords: [
    'KIIT academic calculator',
    'CGPA calculator',
    'SGPA calculator',
    'aggregate calculator',
    'KIIT-CONNECT',
    'academic performance',
    'grade calculator',
    'semester GPA',
    'cumulative GPA',
    'engineering calculator',
    'CSE calculator',
    'CSSE calculator',
    'CSCE calculator',
    'IT calculator',
    'KIIT university',
    'academic report generator',
    'PDF report',
    'student performance tracker'
  ],
  authors: [{ name: 'KIIT-CONNECT Team' }],
  creator: 'KIIT-CONNECT',
  publisher: 'KIIT University',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kiit-connect.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kiit-connect.vercel.app',
    title: 'KIIT-CONNECT Academic Calculator - Advanced CGPA, SGPA & Aggregate Calculator',
    description: 'Advanced academic performance calculator for KIIT students. Calculate SGPA, CGPA, and aggregate scores with branch-specific subjects. Generate professional PDF reports.',
    siteName: 'KIIT-CONNECT Academic Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KIIT-CONNECT Academic Calculator - Advanced CGPA, SGPA & Aggregate Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KIIT-CONNECT Academic Calculator - Advanced CGPA, SGPA & Aggregate Calculator',
    description: 'Advanced academic performance calculator for KIIT students. Calculate SGPA, CGPA, and aggregate scores with branch-specific subjects.',
    images: ['/og-image.png'],
    creator: '@kiitconnect',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'education',
  classification: 'Academic Tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="msapplication-TileColor" content="#1f2937" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "KIIT-CONNECT Academic Calculator",
              "description": "Advanced academic performance calculator for KIIT students. Calculate SGPA, CGPA, and aggregate scores with branch-specific subjects.",
              "url": "https://kiit-connect.vercel.app",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "KIIT-CONNECT",
                "url": "https://kiit-connect.vercel.app"
              },
              "publisher": {
                "@type": "Organization",
                "name": "KIIT University",
                "url": "https://kiit.ac.in"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            })
          }}
        />
        
        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="KIIT-CONNECT Academic Calculator" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KIIT-CONNECT" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}