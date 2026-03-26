'use client'

import {useState} from 'react'
import Link from 'next/link'
import Image from 'next/image'

type NavItem = {
  _key: string
  label: string
  sectionId: string
}

type LogoImage = {
  asset?: {
    url?: string
  } | null
  alt?: string | null
} | null

type HeaderProps = {
  title?: string | null
  logo?: LogoImage
  navigation?: NavItem[] | null
}

export default function Header({title, logo, navigation}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const target = document.getElementById(sectionId)
    if (target) {
      target.scrollIntoView({behavior: 'smooth'})
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed z-50 top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {logo?.asset?.url ? (
              <Image
                src={logo.asset.url}
                alt={logo.alt || title || '4500 Northlands'}
                width={180}
                height={48}
                className="h-10 lg:h-12 w-auto"
                priority
              />
            ) : (
              <span className="text-xl lg:text-2xl font-bold text-gray-900">
                {title || '4500 Northlands'}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navigation?.map((item) => (
                <li key={item._key}>
                  <a
                    href={`#${item.sectionId}`}
                    onClick={(e) => handleNavClick(e, item.sectionId)}
                    className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <ul className="flex flex-col gap-4">
              {navigation?.map((item) => (
                <li key={item._key}>
                  <a
                    href={`#${item.sectionId}`}
                    onClick={(e) => handleNavClick(e, item.sectionId)}
                    className="block text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
