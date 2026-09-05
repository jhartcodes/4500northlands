'use client'

import type {CmsImage} from '@/sanity/lib/types'
import Image from 'next/image'
import {stegaClean} from 'next-sanity'
import {urlForImage} from '@/sanity/lib/utils'
import SectionWrapper, {isDarkBackground} from '@/app/components/ui/SectionWrapper'

type TextTile = {
  _key: string
  _type: 'textTile'
  background?: 'white' | 'cream' | 'mist'
  title?: string
  titleSize?: TextSize
  body?: string
  bodySize?: TextSize
}

type ImageTile = {
  _key: string
  _type: 'imageTile'
  image?: CmsImage
}

type MosaicTile = TextTile | ImageTile

type MosaicRow = {
  _key: string
  tiles?: MosaicTile[]
}

type MosaicGridBlockProps = {
  block: {
    _key: string
    _type: 'mosaicGridBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist' | 'navy' | 'forest'
    sectionLabel?: string
    title?: string
    rows?: MosaicRow[]
  }
  index: number
  pageId: string
  pageType: string
}

type TextSize = 'small' | 'medium' | 'large' | 'extraLarge'

/**
 * Every lookup below holds fully literal class strings — Tailwind cannot see class
 * names built by interpolation, so the sizes and surfaces have to be spelled out.
 */
const titleSizeClasses: Record<TextSize, string> = {
  small: 'text-xl md:text-2xl',
  medium: 'text-2xl md:text-3xl',
  large: 'text-3xl md:text-4xl',
  extraLarge: 'text-4xl md:text-5xl lg:text-6xl',
}

const bodySizeClasses: Record<TextSize, string> = {
  small: 'text-sm md:text-base',
  medium: 'text-base md:text-lg',
  large: 'text-lg md:text-xl',
  extraLarge: 'text-xl md:text-2xl',
}

const tileBgClasses: Record<string, string> = {
  white: 'bg-white',
  cream: 'bg-cream',
  mist: 'bg-mist',
}

/**
 * A 3-tile row jumps straight from one column to three, skipping a two-column stage
 * that would strand the third tile on a half-empty line. Rows must never show a gap.
 */
const rowColumnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
}

const rowImageSizes: Record<number, string> = {
  2: '(max-width: 640px) 100vw, 50vw',
  3: '(max-width: 768px) 100vw, 33vw',
}

/** Tiles never crop: this is a floor, and long copy grows the tile and its row. */
const TILE_MIN_HEIGHT = 'min-h-[220px] md:min-h-[300px]'

function pickSize(value: string | undefined, fallback: TextSize): TextSize {
  const clean = stegaClean(value) as TextSize | undefined
  return clean && clean in titleSizeClasses ? clean : fallback
}

function MosaicTextTile({tile}: {tile: TextTile}) {
  const bg = stegaClean(tile.background) || 'cream'
  const bgClass = tileBgClasses[bg] || tileBgClasses.cream
  const titleClass = titleSizeClasses[pickSize(tile.titleSize, 'large')]
  const bodyClass = bodySizeClasses[pickSize(tile.bodySize, 'medium')]

  return (
    <div
      className={`flex ${TILE_MIN_HEIGHT} flex-col items-center justify-center px-6 py-8 text-center md:px-8 ${bgClass}`}
    >
      {tile.title && (
        <p className={`font-display font-bold leading-none break-words text-navy ${titleClass}`}>
          {tile.title}
        </p>
      )}
      {tile.body && (
        <p
          className={`break-words leading-snug text-navy ${bodyClass} ${tile.title ? 'mt-3' : ''}`}
        >
          {tile.body}
        </p>
      )}
    </div>
  )
}

function MosaicImageTile({tile, sizes}: {tile: ImageTile; sizes: string}) {
  const imageUrl = tile.image
    ? urlForImage(tile.image)?.width(900).height(600).quality(80).auto('format').fit('crop').url()
    : null

  return (
    <div className={`relative ${TILE_MIN_HEIGHT} bg-mist`}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={(tile.image as {alt?: string})?.alt || ''}
          fill
          className="object-cover"
          sizes={sizes}
        />
      )}
    </div>
  )
}

export default function MosaicGridBlock({block}: MosaicGridBlockProps) {
  const {sectionId, background, sectionLabel, title, rows} = block

  if (!rows || rows.length === 0) {
    return null
  }

  const isDark = isDarkBackground(background)
  const hasHeader = Boolean(sectionLabel || title)

  return (
    <SectionWrapper background={background} sectionId={sectionId}>
      {hasHeader && (
        <div className="container mb-10 md:mb-14">
          {sectionLabel && (
            <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-3">
              {sectionLabel}
            </p>
          )}
          {title && (
            <h2
              className={`font-display text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-navy'}`}
            >
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Full bleed: deliberately outside `.container`, so the mosaic runs edge to edge. */}
      <div>
        {rows.map((row) => {
          const tiles = row.tiles || []
          if (tiles.length === 0) return null

          const columnClass = rowColumnClasses[tiles.length] || rowColumnClasses[2]
          const sizes = rowImageSizes[tiles.length] || rowImageSizes[2]

          return (
            <div key={row._key} className={`grid ${columnClass}`}>
              {tiles.map((tile) =>
                tile._type === 'imageTile' ? (
                  <MosaicImageTile key={tile._key} tile={tile} sizes={sizes} />
                ) : (
                  <MosaicTextTile key={tile._key} tile={tile} />
                ),
              )}
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
