'use client'

import Link from 'next/link'
import {stegaClean} from 'next-sanity'

type ButtonVariant = 'primary' | 'forest' | 'outlineWhite' | 'outlineDark'

type ButtonProps = {
  label?: string
  href?: string
  variant?: ButtonVariant
  openInNewTab?: boolean
  className?: string
}

function getButtonClasses(variant: ButtonVariant | undefined): string {
  const cleanVariant = stegaClean(variant) || 'forest'
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 text-base font-semibold transition-all duration-200'

  switch (cleanVariant) {
    case 'primary':
      return `${baseClasses} bg-gold text-navy clip-corner hover:bg-gold/90`
    case 'forest':
      return `${baseClasses} bg-forest text-white clip-corner hover:bg-forest/90`
    case 'outlineWhite':
      return `${baseClasses} border-2 border-white text-white hover:bg-white/10`
    case 'outlineDark':
      return `${baseClasses} border-2 border-navy text-navy hover:bg-navy/5`
    default:
      return `${baseClasses} bg-forest text-white clip-corner hover:bg-forest/90`
  }
}

export default function Button({label, href, variant, openInNewTab, className = ''}: ButtonProps) {
  if (!label) return null

  const cleanHref = stegaClean(href) || '#'
  const classes = `${getButtonClasses(variant)} ${className}`
  const isExternal = cleanHref.startsWith('http') || cleanHref.startsWith('mailto:') || cleanHref.startsWith('tel:')
  const isAnchor = cleanHref.startsWith('#')

  // For anchor links, use smooth scrolling
  if (isAnchor) {
    return (
      <a
        href={cleanHref}
        className={classes}
        onClick={(e) => {
          e.preventDefault()
          const target = document.querySelector(cleanHref)
          if (target) {
            target.scrollIntoView({behavior: 'smooth'})
          }
        }}
      >
        {label}
      </a>
    )
  }

  // For external links or when openInNewTab is true
  if (isExternal || openInNewTab) {
    return (
      <a
        href={cleanHref}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    )
  }

  // For internal page links
  return (
    <Link href={cleanHref} className={classes}>
      {label}
    </Link>
  )
}

type ButtonWithKey = ButtonProps & {_key?: string}

type ButtonGroupProps = {
  buttons?: ButtonWithKey[]
  className?: string
}

export function ButtonGroup({buttons, className = ''}: ButtonGroupProps) {
  if (!buttons || buttons.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {buttons.map((button, index) => (
        <Button key={button._key || index} {...button} />
      ))}
    </div>
  )
}
