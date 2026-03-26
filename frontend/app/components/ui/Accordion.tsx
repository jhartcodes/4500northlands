'use client'

import {useState} from 'react'

type AccordionItemProps = {
  heading: string
  children: React.ReactNode
  defaultOpen?: boolean
  isDark?: boolean
  badge?: {
    text: string
    variant: 'cac' | 'addedBenefit'
  }
}

export function AccordionItem({heading, children, defaultOpen = false, isDark = false, badge}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const textColor = isDark ? 'text-white' : 'text-navy'
  const borderColor = isDark ? 'border-white/20' : 'border-navy/10'
  const hoverBg = isDark ? 'hover:bg-white/5' : 'hover:bg-navy/5'

  return (
    <div className={`border-b ${borderColor}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-4 flex items-center justify-between text-left ${hoverBg} transition-colors`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className={`font-display text-lg font-semibold ${textColor}`}>{heading}</span>
          {badge && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                badge.variant === 'cac'
                  ? 'bg-gold/20 text-gold'
                  : 'bg-forest/20 text-forest'
              }`}
            >
              {badge.text}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 ${textColor} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  )
}

type AccordionProps = {
  children: React.ReactNode
  className?: string
}

export default function Accordion({children, className = ''}: AccordionProps) {
  return <div className={className}>{children}</div>
}
