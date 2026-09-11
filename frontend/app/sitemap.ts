import {MetadataRoute} from 'next'

import {SITE_URL} from '@/lib/site-url'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'

/**
 * sitemap.xml. URLs are absolute and built from SITE_URL — never from the request
 * `Host` header, which emitted bare hostnames with no scheme (crawlers reject those)
 * and, because reading headers() opts the route out of static rendering, meant a
 * function invocation on every request for a sitemap that changes a few times a year.
 *
 * See https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {data: pages} = await sanityFetch({
    query: sitemapData,
    perspective: 'published',
    stega: false,
  })

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'monthly',
    },
  ]

  for (const page of pages ?? []) {
    if (!page.slug) continue

    // 'home' renders at / and /home 307s there, so listing it would put a
    // redirecting URL in the sitemap.
    if (page.slug === 'home') continue

    sitemap.push({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
      priority: 0.8,
      changeFrequency: 'monthly',
    })
  }

  return sitemap
}
