/**
 * Custom next/image loader that points every image straight at Sanity's asset CDN.
 *
 * By default next/image rewrites `src` to `/_next/image?url=…`, which sends the image
 * through Vercel's optimizer. Since `urlForImage()` has *already* asked Sanity to resize
 * and encode the asset, that meant transforming a transformed image: a second cache layer
 * on top of one that is already keyed by content hash, a billed Vercel transformation for
 * every (url, w, q, Accept) combination, and webp output where Sanity's `auto=format`
 * returns avif. With this loader the browser fetches cdn.sanity.io directly.
 *
 * The incoming `src` carries whatever `urlForImage()` produced — including the crop rect
 * Sanity derives from an image's hotspot. That is worth preserving, so rather than
 * rebuilding the URL we only rewrite the parts that vary per srcset entry: `w` (and `h`,
 * rescaled to hold the requested aspect ratio) and `q`.
 */
type SanityImageLoader = (args: {src: string; width: number; quality?: number}) => string

const SANITY_CDN = 'https://cdn.sanity.io/'

/** Sanity asset filenames end in `-<width>x<height>.<ext>`. */
const SOURCE_DIMENSIONS = /-(\d+)x(\d+)\.\w+$/

/**
 * Large srcset entries get a lower quality than the design size does.
 *
 * A hero at `sizes="100vw"` is requested at 3840 by a 4K display and by any 1920 laptop at
 * 2x. Holding q=80 there costs 773 KB, against 209 KB at 1920 — and Sanity bandwidth is the
 * one resource on these sites with a hard cap rather than an overage. AVIF degrades very
 * gracefully at high pixel density, where artifacts land below what the eye resolves, so
 * tapering buys back most of that: 3840 at q=55 is 358 KB, still visibly sharper than a
 * 2048 stretched to fill the same screen. Measured on the 5000x3750 hero, warm AVIF.
 *
 * Never raises quality above what the caller asked for.
 */
function qualityForWidth(width: number, authored: number): number {
  if (width <= 1920) return authored
  if (width <= 2560) return Math.min(authored, 65)
  return Math.min(authored, 55)
}

const sanityImageLoader: SanityImageLoader = ({src, width, quality}) => {
  // Local files under /public and anything else non-Sanity are served as-is.
  if (!src.startsWith(SANITY_CDN)) return src

  const url = new URL(src)

  // Never ask the CDN for more pixels than the original has — `fit=crop` will
  // happily upscale, which spends bandwidth to add no detail.
  const source = SOURCE_DIMENSIONS.exec(url.pathname)
  const target = source ? Math.min(width, Number(source[1])) : width

  const requestedWidth = Number(url.searchParams.get('w'))
  const requestedHeight = Number(url.searchParams.get('h'))

  url.searchParams.set('w', String(target))

  if (requestedWidth > 0 && requestedHeight > 0) {
    // The caller pinned an aspect ratio (and possibly a hotspot-derived crop with it).
    // Scale the height to match the new width so the ratio — and the crop — survive.
    url.searchParams.set('h', String(Math.round(target * (requestedHeight / requestedWidth))))
  } else if (!url.searchParams.has('fit')) {
    // No ratio asked for: `max` resizes within the bounds without upscaling or padding.
    url.searchParams.set('fit', 'max')
  }

  // Next passes `quality` only when the component sets it, so a `q` already baked into
  // the URL by `urlForImage().quality(n)` is the author's intent and is the value we taper.
  const authored = quality ?? Number(url.searchParams.get('q')) ?? 75
  url.searchParams.set('q', String(qualityForWidth(target, authored || 75)))

  // Lets Sanity negotiate avif/webp from the browser's Accept header.
  url.searchParams.set('auto', 'format')

  return url.toString()
}

export default sanityImageLoader
