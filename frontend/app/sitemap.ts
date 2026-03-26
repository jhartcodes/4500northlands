import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

/**
 * This file creates a sitemap (sitemap.xml) for the application.
 * Learn more: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPages = await sanityFetch({
    query: sitemapData,
  })
  const headersList = await headers()
  const sitemap: MetadataRoute.Sitemap = []
  const domain: string = headersList.get('host') as string

  // Add home page
  sitemap.push({
    url: domain as string,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: 'monthly',
  })

  if (allPages != null && allPages.data.length != 0) {
    for (const p of allPages.data) {
      // Skip home page as it's already added
      if (p.slug === 'home') continue

      sitemap.push({
        url: `${domain}/${p.slug}`,
        lastModified: p._updatedAt || new Date(),
        priority: 0.8,
        changeFrequency: 'monthly',
      })
    }
  }

  return sitemap
}
