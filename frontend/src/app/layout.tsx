import type { Metadata } from 'next'
import { Manrope } from "next/font/google";
import './globals.css'
import '@mantine/core/styles.css';
import { theme } from '../../theme';

import { MantineProvider, ColorSchemeScript } from '@mantine/core';

const manropeFont = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FLH',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <ColorSchemeScript />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={manropeFont.className}><MantineProvider theme={theme}>{children}</MantineProvider></body>
    </html>
  )
}
