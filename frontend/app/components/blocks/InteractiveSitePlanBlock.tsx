'use client'

import {useState, useCallback, useEffect, useRef} from 'react'
import Image from 'next/image'
import CustomPortableText from '@/app/components/PortableText'

// ─────────────────────────────────────────────────────────────────────────────
// MAP CONFIG — edit hotspot x/y positions here (percentage of image dimensions)
// Label/description come from Sanity — only positions live here.
// ─────────────────────────────────────────────────────────────────────────────
type HotspotPosition = {
  number: number
  x: number // % from left of image
  y: number // % from top of image
}

type Hotspot = HotspotPosition & {
  key: string
  label: string
  description: string
}

type Orientation = 'landscape' | 'portrait'

type MapConfig = {
  label: string
  src: string
  width: number
  height: number
  orientation: Orientation
  positions: HotspotPosition[]
}

const MAP_CONFIG: Record<string, MapConfig> = {
  fullsite: {
    label: 'Full Site',
    src: '/images/FullSite.avif',
    width: 1448,
    height: 1086,
    orientation: 'landscape',
    positions: [
      {number: 1, x: 49, y: 85},
      {number: 2, x: 64, y: 85},
      {number: 3, x: 40, y: 55},
      {number: 4, x: 25, y: 20},
      {number: 5, x: 32, y: 70},
    ],
  },
  lowermeadow: {
    label: 'Lower Meadow',
    src: '/images/lowermeadow.avif',
    width: 1448,
    height: 1086,
    orientation: 'landscape',
    positions: [
      {number: 1, x: 44, y: 70},
      {number: 2, x: 36, y: 60},
      {number: 3, x: 50, y: 56},
      {number: 4, x: 62, y: 55},
      {number: 5, x: 84, y: 59},
      {number: 6, x: 84, y: 82},
      {number: 7, x: 24, y: 14},
      {number: 8, x: 59, y: 27},
    ],
  },
  uppermeadow: {
    label: 'Upper Meadow',
    src: '/images/uppermeadow.avif',
    width: 950,
    height: 1655,
    orientation: 'portrait',
    positions: [
      {number: 1, x: 40, y: 25},
      {number: 2, x: 55, y: 38},
      {number: 3, x: 35, y: 50},
      {number: 4, x: 60, y: 55},
      {number: 5, x: 45, y: 65},
      {number: 6, x: 55, y: 75},
      {number: 7, x: 35, y: 82},
    ],
  },
}

// Per-orientation max-width on tablet+. Mobile is always full-bleed.
const orientationWrapperClass: Record<Orientation, string> = {
  landscape: 'md:max-w-[clamp(640px,80vw,1024px)] md:mx-auto',
  portrait: 'md:max-w-[clamp(360px,45vw,480px)] md:mx-auto',
}

// ─────────────────────────────────────────────────────────────────────────────

type CmsHotspot = {
  _key: string
  number: number
  label: string
  description?: string
}

type MapEntry = {
  _key: string
  mapTitle?: string
  mapId: string
  pdfUrl?: string
  hotspots?: CmsHotspot[]
}

type InteractiveSitePlanBlockProps = {
  block: {
    _key: string
    _type: 'interactiveSitePlanBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist'
    title?: string
    body?: any[]
    maps?: MapEntry[]
  }
  index: number
  pageId: string
  pageType: string
}

const bgClasses: Record<string, string> = {
  white: 'bg-white',
  cream: 'bg-cream',
  mist: 'bg-mist',
}

export default function InteractiveSitePlanBlock({block}: InteractiveSitePlanBlockProps) {
  const {sectionId, background = 'white', title, body, maps} = block

  return (
    <section
      id={sectionId || undefined}
      className={`${bgClasses[background]} section-padding max-md:[--container-padding:12px]`}
    >
      <div className="container">
        {(title || body) && (
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            {title && (
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">
                {title}
              </h2>
            )}
            {body && body.length > 0 && (
              <div className="text-navy/70">
                <CustomPortableText value={body} />
              </div>
            )}
          </div>
        )}

        <div className="space-y-16 md:space-y-24">
          {maps?.map((entry) => {
            const config = MAP_CONFIG[entry.mapId]
            if (!config) return null
            return (
              <SitePlanMap
                key={entry._key}
                config={config}
                mapTitle={entry.mapTitle}
                pdfUrl={entry.pdfUrl}
                cmsHotspots={entry.hotspots}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

type SitePlanMapProps = {
  config: MapConfig
  mapTitle?: string
  pdfUrl?: string
  cmsHotspots?: CmsHotspot[]
}

function SitePlanMap({config, mapTitle, pdfUrl, cmsHotspots}: SitePlanMapProps) {
  const {label, src, width, height, orientation, positions} = config

  // Merge hardcoded positions with CMS text, keyed by number
  const hotspots: Hotspot[] = positions.map((pos) => {
    const cms = cmsHotspots?.find((h) => h.number === pos.number)
    return {
      ...pos,
      key: `${config.src}-${pos.number}`,
      label: cms?.label ?? `Marker ${pos.number}`,
      description: cms?.description ?? '',
    }
  })
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const chipListRef = useRef<HTMLDivElement>(null)

  const visibleKey = activeKey || hoveredKey
  const activeHotspot = hotspots.find((h) => h.key === visibleKey) ?? null

  const handleMarkerClick = useCallback((key: string) => {
    setActiveKey((prev) => (prev === key ? null : key))
  }, [])

  const handleChipClick = useCallback((key: string) => {
    setActiveKey((prev) => (prev === key ? null : key))
    const chip = chipListRef.current?.querySelector(`[data-key="${key}"]`)
    chip?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'})
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveKey(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveKey(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef}>
      {/* On tablet+ each map is constrained per its orientation */}
      <div className={orientationWrapperClass[orientation]}>
        {/* Map heading row */}
        {(mapTitle || pdfUrl) && (
          <div className="flex items-center justify-between mb-3 md:mb-4">
            {mapTitle && (
              <p className="text-sm uppercase tracking-widest text-navy font-semibold">
                {mapTitle}
              </p>
            )}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold/80 transition-colors shrink-0 ml-auto"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                Download PDF
              </a>
            )}
          </div>
        )}

        {/* Mobile chip scrollbar — bleeds to screen edges */}
        <div
          ref={chipListRef}
          className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-3 mx-4"
          style={{scrollbarWidth: 'none'}}
        >
          {hotspots.map((h) => {
            const isActive = activeKey === h.key
            return (
              <button
                key={h.key}
                data-key={h.key}
                onClick={() => handleChipClick(h.key)}
                className={`
                shrink-0 flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full
                border text-sm font-medium transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
                ${
                  isActive
                    ? 'bg-gold border-gold text-navy shadow-md'
                    : 'bg-white border-navy/15 text-navy/70'
                }
              `}
              >
                <span
                  className={`
                w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${isActive ? 'bg-navy text-gold' : 'bg-navy/10 text-navy'}
              `}
                >
                  {h.number}
                </span>
                {h.label}
              </button>
            )
          })}
        </div>

        {/* Image + hotspot overlay — bleeds on mobile, natural ratio on desktop.
            container-type:inline-size lets child markers scale relative to image width. */}
        <div
          className="relative -mx-[var(--container-padding)] md:mx-0 [container-type:inline-size]"
          style={{aspectRatio: `${width}/${height}`}}
        >
          {/* Image — rounded corners on md+ only since mobile bleeds */}
          <div className="absolute inset-0 md:rounded-lg overflow-hidden">
            <Image
              src={src}
              alt={label}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1024px"
              priority
            />
          </div>

          {/* Hotspot markers — outside overflow-hidden so tooltips aren't clipped */}
          {hotspots.map((h) => {
            const isActive = activeKey === h.key
            const isVisible = visibleKey === h.key

            // Three-zone tooltip positioning — keeps tooltip inside the image
            const tooltipZone = h.x < 30 ? 'left' : h.x > 70 ? 'right' : 'center'
            const tooltipAbove = h.y > 55

            const tooltipPositionClass =
              tooltipZone === 'left'
                ? 'left-0'
                : tooltipZone === 'right'
                  ? 'right-0'
                  : 'left-1/2 -translate-x-1/2'

            const arrowPositionClass =
              tooltipZone === 'left'
                ? 'left-4'
                : tooltipZone === 'right'
                  ? 'right-4'
                  : 'left-1/2 -translate-x-1/2'

            return (
              <div
                key={h.key}
                className="absolute"
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: isVisible ? 30 : 1,
                }}
              >
                <button
                  onClick={() => handleMarkerClick(h.key)}
                  onMouseEnter={() => setHoveredKey(h.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  style={{
                    width: 'clamp(28px, 4cqi, 44px)',
                    height: 'clamp(28px, 4cqi, 44px)',
                    fontSize: 'clamp(0.75rem, 1.6cqi, 1rem)',
                  }}
                  className={`
                  relative rounded-full
                  font-bold
                  flex items-center justify-center
                  ring-2 ring-white/80
                  transition-all duration-200 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gold
                  ${
                    isActive
                      ? 'bg-navy text-gold scale-110 shadow-xl ring-white'
                      : 'bg-gold text-navy shadow-md hover:scale-110 hover:shadow-xl'
                  }
                `}
                  aria-label={`${h.label}: ${h.description}`}
                  aria-expanded={isVisible}
                >
                  {h.number}
                </button>

                {/* Desktop tooltip — hidden on mobile */}
                <div
                  className={`
                  hidden md:block absolute
                  w-[min(16rem,80cqi)]
                  bg-cream border border-navy/10 rounded-lg shadow-lg p-4
                  transition-all duration-200
                  ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
                  ${tooltipAbove ? 'bottom-full mb-4' : 'top-full mt-4'}
                  ${tooltipPositionClass}
                `}
                  role="tooltip"
                >
                  <div
                    className={`
                    absolute w-3 h-3 bg-cream border-navy/10 rotate-45
                    ${tooltipAbove ? 'bottom-[-6px] border-r border-b' : 'top-[-6px] border-l border-t'}
                    ${arrowPositionClass}
                  `}
                  />
                  <div className="relative">
                    <h4 className="font-display font-bold text-navy mb-1">{h.label}</h4>
                    <p className="text-sm text-navy/70 leading-relaxed">{h.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile info card — only renders when a hotspot is active */}
        {activeHotspot && (
          <div className="md:hidden mt-4">
            <div className="bg-cream border border-navy/10 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0 w-7 h-7 rounded-full bg-gold text-navy flex items-center justify-center text-sm font-bold">
                  {activeHotspot.number}
                </span>
                <div>
                  <h4 className="font-display font-bold text-navy leading-tight">
                    {activeHotspot.label}
                  </h4>
                  <p className="text-sm text-navy/70 leading-relaxed mt-0.5">
                    {activeHotspot.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop legend */}
        <div className="hidden md:flex flex-wrap gap-3 justify-center mt-6">
          {hotspots.map((h) => {
            const isActive = activeKey === h.key
            return (
              <button
                key={h.key}
                onClick={() => handleMarkerClick(h.key)}
                className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2
                ${
                  isActive
                    ? 'bg-gold/10 border-gold shadow-md'
                    : 'bg-white border-navy/10 hover:border-gold/50 hover:shadow-sm'
                }
              `}
                aria-pressed={isActive}
              >
                <span
                  className={`
                w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200
                ${isActive ? 'bg-gold text-navy' : 'bg-navy/10 text-navy'}
              `}
                >
                  {h.number}
                </span>
                <span className="text-sm text-navy/80">{h.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
