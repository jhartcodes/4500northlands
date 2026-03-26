import type {Metadata} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery} from '@/sanity/lib/queries'
import PageBuilderPage from '@/app/components/PageBuilder'
import {PageOnboarding} from '@/app/components/Onboarding'

/**
 * Generate metadata for the home page.
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: 'home'},
    stega: false,
  })

  return {
    title: page?.seoTitle || page?.name || '4500 Northlands',
    description: page?.seoDescription || 'A housing solution for Whistler',
  } satisfies Metadata
}

export default async function HomePage() {
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params: {slug: 'home'},
  })

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    )
  }

  return <PageBuilderPage page={page} />
}
