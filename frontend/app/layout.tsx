import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Suspense} from 'react'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, homeNavigationQuery} from '@/sanity/lib/queries'
import {handleError} from '@/app/client-utils'

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })

  return {
    title: {
      template: `%s | ${settings?.title || '4500 Northlands'}`,
      default: settings?.title || '4500 Northlands',
    },
    description: settings?.description || 'A housing solution for Whistler',
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()

  // Fetch navigation from home page and settings
  const [{data: homeNav}, {data: settings}] = await Promise.all([
    sanityFetch({query: homeNavigationQuery}),
    sanityFetch({query: settingsQuery}),
  ])

  return (
    <html lang="en" className="bg-white text-black">
      <body className="font-body antialiased">
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <Suspense fallback={null}>
          <SanityLive onError={handleError} refreshOnFocus={false} refreshOnReconnect={false} />
        </Suspense>
        <Header title={settings?.title || homeNav?.name} logo={settings?.logo} navigation={homeNav?.navigation} />
        <main className="min-h-screen">{children}</main>
        <Footer privacyPolicyUrl={settings?.privacyPolicyUrl} />
        <SpeedInsights />
      </body>
    </html>
  )
}
