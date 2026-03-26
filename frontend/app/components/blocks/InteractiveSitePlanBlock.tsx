'use client'

import {useState, useCallback, useEffect, useRef} from 'react'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

type Hotspot = {
  _key: string
  number?: number
  positionX?: number
  positionY?: number
  label?: string
  description?: string
}

type InteractiveSitePlanBlockProps = {
  block: {
    _key: string
    _type: 'interactiveSitePlanBlock'
    sectionId?: string
    background?: 'white' | 'cream' | 'mist'
    title?: string
    sitePlanImage?: any
    hotspots?: Hotspot[]
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
  const {sectionId, background = 'white', title, sitePlanImage, hotspots} = block
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const sitePlanUrl = sitePlanImage
    ? urlForImage(sitePlanImage)?.width(1400)?.height(900)?.url()
    : null

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveHotspot(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveHotspot(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleMarkerClick = useCallback((key: string) => {
    setActiveHotspot((prev) => (prev === key ? null : key))
  }, [])

  const handleLegendClick = useCallback((key: string) => {
    setActiveHotspot((prev) => (prev === key ? null : key))
  }, [])

  // Determine which hotspot to show tooltip for (active takes precedence over hover)
  const visibleHotspot = activeHotspot || hoveredHotspot

  return (
    <section id={sectionId || undefined} className={`${bgClasses[background]} section-padding`}>
      <div className="container">
        {title && (
          <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-8 text-center">
            {title}
          </h2>
        )}

        {/* Site Plan with Hotspots */}
        {sitePlanUrl && (
          <div ref={containerRef} className="relative">
            {/* Image Container */}
            <div className="relative aspect-[14/9] rounded-lg overflow-hidden">
              <Image
                src={sitePlanUrl}
                alt={title || 'Site plan'}
                fill
                className="object-contain bg-mist/50"
                sizes="100vw"
              />

              {/* Hotspot Markers */}
              {hotspots?.map((hotspot) => {
                const isActive = activeHotspot === hotspot._key
                const isHovered = hoveredHotspot === hotspot._key
                const isVisible = visibleHotspot === hotspot._key

                return (
                  <HotspotMarker
                    key={hotspot._key}
                    hotspot={hotspot}
                    isActive={isActive}
                    isHovered={isHovered}
                    isVisible={isVisible}
                    onClick={() => handleMarkerClick(hotspot._key)}
                    onMouseEnter={() => setHoveredHotspot(hotspot._key)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                  />
                )
              })}
            </div>

            {/* Legend */}
            {hotspots && hotspots.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {hotspots.map((hotspot) => {
                  const isActive = activeHotspot === hotspot._key

                  return (
                    <button
                      key={hotspot._key}
                      onClick={() => handleLegendClick(hotspot._key)}
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
                        {hotspot.number}
                      </span>
                      <span className="text-sm text-navy/80">{hotspot.label}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

type HotspotMarkerProps = {
  hotspot: Hotspot
  isActive: boolean
  isHovered: boolean
  isVisible: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function HotspotMarker({
  hotspot,
  isActive,
  isVisible,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: HotspotMarkerProps) {
  const {number, positionX = 50, positionY = 50, label, description} = hotspot

  // Determine tooltip position based on marker position
  const tooltipOnRight = positionX < 50
  const tooltipAbove = positionY > 60

  return (
    <div
      className="absolute"
      style={{
        left: `${positionX}%`,
        top: `${positionY}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Marker Button */}
      <button
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`
          relative z-10
          w-8 h-8 md:w-10 md:h-10 rounded-full
          bg-gold text-navy font-bold text-sm md:text-base
          flex items-center justify-center
          transition-all duration-200 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gold
          ${
            isActive
              ? 'scale-110 shadow-xl ring-2 ring-white'
              : 'shadow-lg hover:scale-110 hover:shadow-xl'
          }
        `}
        aria-label={`${label}: ${description || ''}`}
        aria-expanded={isVisible}
      >
        {number}
      </button>

      {/* Tooltip */}
      <div
        className={`
          absolute z-20 w-56 md:w-64
          bg-cream border border-navy/10 rounded-lg shadow-lg
          p-4 transition-all duration-200
          ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
          ${tooltipAbove ? 'bottom-full mb-3' : 'top-full mt-3'}
          ${tooltipOnRight ? 'left-0' : 'right-0'}
        `}
        role="tooltip"
      >
        {/* Arrow */}
        <div
          className={`
            absolute w-3 h-3 bg-cream border-navy/10 rotate-45
            ${tooltipAbove ? 'bottom-[-6px] border-r border-b' : 'top-[-6px] border-l border-t'}
            ${tooltipOnRight ? 'left-4' : 'right-4'}
          `}
        />

        {/* Content */}
        <div className="relative">
          <h4 className="font-display font-bold text-navy mb-1">{label}</h4>
          {description && <p className="text-sm text-navy/70 leading-relaxed">{description}</p>}
        </div>
      </div>
    </div>
  )
}
