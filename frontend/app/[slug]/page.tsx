import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    perspective: 'published',
    stega: false,
  })
  // Filter out 'home' since it's handled by the root page
  return data?.filter((item: {slug: string}) => item.slug !== 'home') || []
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    stega: false,
  })

  return {
    title: page?.seoTitle || page?.name,
    description: page?.seoDescription,
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const params = await props.params

  // Redirect /home to root
  if (params.slug === 'home') {
    notFound()
  }

  const {data: page} = await sanityFetch({query: getPageQuery, params})

  if (!page?._id) {
    notFound()
  }

  return <PageBuilderPage page={page} />
}
