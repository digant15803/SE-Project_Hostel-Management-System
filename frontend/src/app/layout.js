import { Manrope } from "next/font/google";
import './globals.css'
import '@mantine/core/styles.css';
import { theme } from '../../theme';
import {
  ApolloProvider,
} from "@apollo/client";

import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';

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
              <Apollo children={children} />
              <Notifications position="top-right" styles={{
                notification: {
                  width: 300,
                  maxHeight: 100,
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                },
              }}/>
          </MantineProvider>
      </body>
    </html>
  )
}
