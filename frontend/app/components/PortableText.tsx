'use client'

import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/utils'

type PortableTextProps = {
  value: PortableTextBlock[]
  className?: string
  /** Whether the text is on a dark background */
  isDark?: boolean
}

export default function CustomPortableText({value, className = '', isDark = false}: PortableTextProps) {
  const textColor = isDark ? 'text-white' : 'text-navy'
  const mutedColor = isDark ? 'text-white/80' : 'text-navy/70'
  const linkColor = isDark ? 'text-gold hover:text-gold/80' : 'text-forest hover:text-forest/80'

  const components: PortableTextComponents = {
    types: {
      image: ({value: img}) => {
        if (!img?.asset?._ref) return null

        const imageUrl = urlForImage(img)?.width(800).quality(80).auto('format').fit('crop').url()
        if (!imageUrl) return null

        return (
          <figure className="my-8">
            <Image
              src={imageUrl}
              alt={img.alt || ''}
              width={800}
              height={600}
              className="rounded-sm w-full h-auto"
            />
            {img.caption && (
              <figcaption className={`mt-2 text-sm ${mutedColor}`}>{img.caption}</figcaption>
            )}
          </figure>
        )
      },
    },

    block: {
      normal: ({children}) => (
        <p className={`text-lg leading-relaxed mb-4 ${textColor}`}>{children}</p>
      ),
      h2: ({children}) => (
        <h2 className={`font-display text-3xl md:text-4xl font-bold mt-8 mb-4 ${textColor}`}>
          {children}
        </h2>
      ),
      h3: ({children}) => (
        <h3 className={`font-display text-2xl md:text-3xl font-semibold mt-6 mb-3 ${textColor}`}>
          {children}
        </h3>
      ),
      h4: ({children}) => (
        <h4 className={`font-display text-xl md:text-2xl font-semibold mt-4 mb-2 ${textColor}`}>
          {children}
        </h4>
      ),
      blockquote: ({children}) => (
        <blockquote className={`border-l-4 border-gold pl-4 italic my-6 ${mutedColor}`}>
          {children}
        </blockquote>
      ),
      // Large Statement — big OCP-style line
      largeStatement: ({children}) => (
        <p className="font-display italic text-forest text-2xl md:text-3xl my-8 leading-relaxed">
          {children}
        </p>
      ),
      // Callout Box — left-border panel
      calloutBox: ({children}) => (
        <div className="border-l-4 border-gold bg-cream/50 pl-6 py-4 my-6 rounded-r">
          <p className={`text-lg ${textColor}`}>{children}</p>
        </div>
      ),
      // Section Label — small gold uppercase
      sectionLabel: ({children}) => (
        <p className="text-sm uppercase tracking-widest text-gold font-semibold mb-2">
          {children}
        </p>
      ),
    },

    marks: {
      strong: ({children}) => <strong className="font-bold">{children}</strong>,
      em: ({children}) => <em className="italic">{children}</em>,
      underline: ({children}) => <span className="underline">{children}</span>,
      link: ({children, value: link}) => {
        const href = link?.href || '#'
        const isExternal = href.startsWith('http')

        return (
          <a
            href={href}
            className={`underline underline-offset-2 ${linkColor}`}
            target={isExternal || link?.openInNewTab ? '_blank' : undefined}
            rel={isExternal || link?.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      },
      // Color accent decorators
      goldAccent: ({children}) => <span className="text-gold">{children}</span>,
      forestAccent: ({children}) => <span className="text-forest">{children}</span>,
      navyAccent: ({children}) => <span className="text-navy">{children}</span>,
    },

    list: {
      bullet: ({children}) => (
        <ul className={`list-disc list-inside text-lg mb-4 space-y-2 ${textColor}`}>{children}</ul>
      ),
      number: ({children}) => (
        <ol className={`list-decimal list-inside text-lg mb-4 space-y-2 ${textColor}`}>
          {children}
        </ol>
      ),
      // Arrow list (→)
      arrowList: ({children}) => (
        <ul className={`text-lg mb-4 space-y-3 ${textColor}`}>{children}</ul>
      ),
      // Dash list (—)
      dashList: ({children}) => (
        <ul className={`text-lg mb-4 space-y-2 ${textColor}`}>{children}</ul>
      ),
    },

    listItem: {
      bullet: ({children}) => <li>{children}</li>,
      number: ({children}) => <li>{children}</li>,
      arrowList: ({children}) => (
        <li className="flex items-start gap-3">
          <span className="text-gold font-bold shrink-0">→</span>
          <span>{children}</span>
        </li>
      ),
      dashList: ({children}) => (
        <li className="flex items-start gap-3">
          <span className="text-gold shrink-0">—</span>
          <span>{children}</span>
        </li>
      ),
    },
  }

  return (
    <div className={className}>
      <PortableText components={components} value={value} />
    </div>
  )
}
