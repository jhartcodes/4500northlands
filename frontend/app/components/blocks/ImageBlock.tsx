'use client'

import type {CmsImage} from '@/sanity/lib/types'
import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'

type Layout = 'full' | 'grid'
type Height = 'short' | 'tall' | 'natural'
type CaptionStyle = 'below' | 'onImage'

type GridImage = CmsImage & {
  _key: string
  alt?: string
  caption?: string
}

type ImageBlockProps = {
  block: {
    _key: string
    _type: 'imageBlock'
    sectionId?: string
    layout?: Layout
    height?: Height
    image?: CmsImage & {alt?: string}
    images?: GridImage[]
    captionStyle?: CaptionStyle
    kicker?: string
    caption?: string
  }
  index: number
  pageId: string
  pageType: string
}

/**
 * `short` is the ratio pair this block has always rendered at; documents with no
 * `height` set fall through to it.
 */
const fullHeights: Record<Exclude<Height, 'natural'>, string> = {
  short: 'aspect-[21/9] md:aspect-[3/1]',
  tall: 'aspect-[4/3] md:aspect-[16/9]',
}

const gridHeights: Record<Exclude<Height, 'natural'>, string> = {
  short: 'aspect-[16/9]',
  tall: 'aspect-[4/3]',
}

const gridCols: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
}

/**
 * CmsImage widens to SanityImageSource, a union that includes bare strings, so
 * `.asset` is not reachable without narrowing first.
 */
type ResolvedImage = {
  asset?: {
    _ref?: string
    metadata?: {dimensions?: {width: number; height: number}}
  }
}

function hasAsset<T extends CmsImage>(img?: T): img is T {
  return Boolean((img as ResolvedImage | undefined)?.asset)
}

/** Sanity asset refs encode their dimensions: image-<hash>-1280x432-png */
function dimensionsOf(img?: CmsImage): {width: number; height: number} {
  const asset = (img as ResolvedImage | undefined)?.asset

  const fromMeta = asset?.metadata?.dimensions
  if (fromMeta?.width && fromMeta?.height) return fromMeta

  const match = asset?._ref?.match(/-(\d+)x(\d+)-/)
  if (match) return {width: Number(match[1]), height: Number(match[2])}

  return {width: 1600, height: 900}
}

function Caption({
  kicker,
  caption,
  onImage,
}: {
  kicker?: string
  caption?: string
  onImage: boolean
}) {
  if (!kicker && !caption) return null

  if (onImage) {
    return (
      <>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 content-padding pb-6 md:pb-10">
          <div className="max-w-3xl">
            {kicker && (
              <p className="text-xs md:text-sm uppercase tracking-widest text-gold font-semibold mb-1.5">
                {kicker}
              </p>
            )}
            {caption && (
              <p className="font-display text-white text-lg md:text-2xl lg:text-3xl font-bold leading-snug">
                {caption}
              </p>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <figcaption className="pt-3">
      <div className="max-w-3xl">
        {kicker && (
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mr-2">
            {kicker}
          </span>
        )}
        {caption && (
          <span className="text-sm md:text-base text-navy/70 leading-relaxed">{caption}</span>
        )}
      </div>
    </figcaption>
  )
}

function Picture({
  image,
  alt,
  height,
  sizes,
  ratioClass,
}: {
  image: CmsImage
  alt: string
  height: Height
  sizes: string
  ratioClass: string
}) {
  const isNatural = height === 'natural'
  const builder = urlForImage(image)
  if (!builder) return null

  if (isNatural) {
    const {width, height: h} = dimensionsOf(image)
    const url = builder.width(1920).quality(80).auto('format').url()
    return <Image src={url} alt={alt} width={width} height={h} sizes={sizes} className="w-full h-auto" />
  }

  const url = builder.width(1920).quality(80).auto('format').fit('crop').url()
  return (
    <div className={`relative w-full overflow-hidden ${ratioClass}`}>
      <Image src={url} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  )
}

export default function ImageBlock({block}: ImageBlockProps) {
  const {sectionId, image, images, kicker, caption} = block

  const layout: Layout = stegaClean(block.layout) === 'grid' ? 'grid' : 'full'
  const rawHeight = stegaClean(block.height)
  const height: Height =
    rawHeight === 'tall' || rawHeight === 'natural' ? rawHeight : 'short'
  const onImage = stegaClean(block.captionStyle) === 'onImage'

  if (layout === 'grid') {
    const items = (images ?? []).filter((img) => hasAsset(img))
    if (items.length === 0) return null

    const cols = gridCols[items.length] ?? 'md:grid-cols-2'
    const sizes =
      items.length === 3 ? '(max-width: 768px) 100vw, 33vw' : '(max-width: 768px) 100vw, 50vw'
    const ratioClass = height === 'natural' ? '' : gridHeights[height]

    return (
      <section id={stegaClean(sectionId) || undefined} className="w-full section-padding">
        <div className="container">
          <div className={`grid grid-cols-1 ${cols} gap-6 md:gap-8`}>
            {items.map((img) => (
              <figure key={img._key} className={onImage ? 'relative overflow-hidden' : undefined}>
                <Picture
                  image={img}
                  alt={img.alt || img.caption || ''}
                  height={height}
                  sizes={sizes}
                  ratioClass={ratioClass}
                />
                <Caption caption={img.caption} onImage={onImage} />
              </figure>
            ))}
          </div>
          {(kicker || caption) && (
            <figure className="mt-4">
              <Caption kicker={kicker} caption={caption} onImage={false} />
            </figure>
          )}
        </div>
      </section>
    )
  }

  if (!hasAsset(image)) return null

  const ratioClass = height === 'natural' ? '' : fullHeights[height]

  // Full-bleed: the caption needs the page gutter, the image does not.
  return (
    <section id={stegaClean(sectionId) || undefined} className="w-full">
      <figure className={onImage ? 'relative w-full overflow-hidden' : 'w-full'}>
        <Picture
          image={image}
          alt={image.alt || caption || ''}
          height={height}
          sizes="100vw"
          ratioClass={ratioClass}
        />
        {onImage ? (
          <Caption kicker={kicker} caption={caption} onImage />
        ) : (
          <div className="content-padding">
            <Caption kicker={kicker} caption={caption} onImage={false} />
          </div>
        )}
      </figure>
    </section>
  )
}
