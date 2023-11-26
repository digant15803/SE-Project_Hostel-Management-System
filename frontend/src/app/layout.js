import { Manrope } from "next/font/google";
import './globals.css'
import '@mantine/core/styles.css';
import { theme } from '../../theme';
import {
  ApolloProvider,
} from "@apollo/client";

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const manropeFont = Manrope({ subsets: ["latin"] });

import Apollo  from "@/app/Apollo";

export const metadata = {
  title: 'FLH',
  description: '',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <ColorSchemeScript />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={manropeFont.className}>
          <MantineProvider theme={theme}>
            <Notifications />
              <Apollo children={children} />
          </MantineProvider>
      </body>
    </html>
  )
}
