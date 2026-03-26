'use client'

import {stegaClean} from 'next-sanity'

type BackgroundColor = 'white' | 'cream' | 'mist' | 'navy' | 'forest'

type SectionWrapperProps = {
  children: React.ReactNode
  background?: BackgroundColor
  sectionId?: string
  className?: string
  /** Add full section padding */
  fullPadding?: boolean
}

const bgClasses: Record<BackgroundColor, string> = {
  white: 'bg-white',
  cream: 'bg-cream',
  mist: 'bg-mist',
  navy: 'bg-navy',
  forest: 'bg-forest',
}

export function isDarkBackground(background?: BackgroundColor): boolean {
  const bg = stegaClean(background) || 'white'
  return bg === 'navy' || bg === 'forest'
}

export default function SectionWrapper({
  children,
  background,
  sectionId,
  className = '',
  fullPadding = true,
}: SectionWrapperProps) {
  const bg = stegaClean(background) || 'white'
  const bgClass = bgClasses[bg as BackgroundColor] || bgClasses.white
  const paddingClass = fullPadding ? 'section-padding' : ''

  return (
    <section
      id={stegaClean(sectionId) || undefined}
      className={`${bgClass} ${paddingClass} ${className}`}
    >
      {children}
    </section>
  )
}
